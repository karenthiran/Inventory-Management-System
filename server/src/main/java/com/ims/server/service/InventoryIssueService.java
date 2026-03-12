package com.ims.server.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ims.server.dto.IssueNotificationRequest;
import com.ims.server.model.CurrentIssuedInventory;
import com.ims.server.model.IssuedItem;
import com.ims.server.model.Location;
import com.ims.server.model.ReturnedItem;
import com.ims.server.repository.CurrentInventoryRepository;
import com.ims.server.repository.InventoryItemRepository;
import com.ims.server.repository.IssuedItemRepository;
import com.ims.server.repository.LocationRepository;
import com.ims.server.repository.ReturnedItemRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryIssueService {

    private final IssuedItemRepository issueRepo;
    private final CurrentInventoryRepository currentRepo;
    private final InventoryItemRepository inventoryItemRepo;
    private final ReturnedItemRepository returnedItemRepo;
    private final LocationRepository locationRepo;
    private final EmailService emailService;

    public List<String> getUniqueAvailableItemNames() {
        return inventoryItemRepo.findUniqueAvailableItemNames();
    }

    public List<String> getAvailableCodesByItemName(String itemName) {
        return inventoryItemRepo.findAvailableCodesByItemName(itemName);
    }

    @Transactional
    public IssuedItem issueItems(IssuedItem request) {

        if (request.getIssuedTo() == null || request.getIssuedTo().isBlank()) {
            throw new RuntimeException("Validation Error: Recipient username is required.");
        }

        if (request.getLocation() != null) {
            Location persistentLocation = locationRepo.findById(request.getLocation().getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            request.setLocation(persistentLocation);
        }

        String snapshotRaw = request.getItemCodesSnapshot();
        if (snapshotRaw == null || snapshotRaw.isBlank()) {
            throw new RuntimeException("Validation Error: At least one Item Code must be selected.");
        }

        List<String> requestedCodes = List.of(snapshotRaw.split(","));

        for (String code : requestedCodes) {
            if (currentRepo.existsById(code)) {
                throw new RuntimeException("Validation Error: Item Code '" + code + "' is already currently issued.");
            }
        }

        for (String code : requestedCodes) {
            currentRepo.save(new CurrentIssuedInventory(code));
            inventoryItemRepo.findById(code).ifPresent(item -> {
                if (item.getQuantity() > 0) {
                    item.setQuantity(item.getQuantity() - 1);
                    inventoryItemRepo.save(item);
                }
            });
        }

        request.setIssueDate(LocalDate.now());
        request.setQuantity(requestedCodes.size());
        request.setIsReturned(false);

        // ✅ Save once
        IssuedItem saved = issueRepo.save(request);

        // ✅ Send email notification — don't fail transaction if email fails
        try {
            if (request.getIssuedToEmail() != null && !request.getIssuedToEmail().isBlank()) {
                IssueNotificationRequest notification = new IssueNotificationRequest();
                notification.setToEmail(request.getIssuedToEmail());
                notification.setUsername(request.getIssuedTo());
                notification.setItemName(request.getItemName());
                notification.setItemCodes(request.getItemCodesSnapshot());
                notification.setIssuedBy(request.getIssuedBy());
                notification.setIssueDate(request.getIssueDate().toString());
                notification.setExpectedReturnDate(
                        request.getExpectedReturnDate() != null
                                ? request.getExpectedReturnDate().toString()
                                : "N/A");
                notification.setLocation(
                        request.getLocation() != null
                                ? request.getLocation().getLocationName()
                                : "N/A");
                emailService.sendIssueNotification(notification);
            }
        } catch (Exception e) {
            System.err.println("Email notification failed: " + e.getMessage());
        }

        return saved;
    }

    public List<IssuedItem> getAllIssuedItems() {
        return issueRepo.findAll();
    }

    public IssuedItem getIssueById(Long id) {
        return issueRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue record not found with ID: " + id));
    }

    @Transactional
    public IssuedItem updateExpectedReturnDate(Long id, LocalDate newDate) {
        IssuedItem existingIssue = getIssueById(id);

        if (Boolean.TRUE.equals(existingIssue.getIsReturned())) {
            throw new RuntimeException("Cannot edit dates for a record that has already been returned.");
        }

        existingIssue.setExpectedReturnDate(newDate);
        return issueRepo.save(existingIssue);
    }

    @Transactional
    public void processReturn(ReturnedItem returnRequest) {
        if (returnRequest.getIssuedItem() == null || returnRequest.getIssuedItem().getId() == null) {
            throw new RuntimeException("Validation Error: Issued Item ID is missing.");
        }

        Long issueId = returnRequest.getIssuedItem().getId();
        IssuedItem persistentIssue = getIssueById(issueId);

        if (Boolean.TRUE.equals(persistentIssue.getIsReturned())) {
            throw new RuntimeException("This item has already been marked as returned.");
        }

        String snapshot = persistentIssue.getItemCodesSnapshot();
        List<String> codesToProcess = (snapshot != null && !snapshot.isBlank())
                ? List.of(snapshot.split(","))
                : List.of();

        for (String code : codesToProcess) {
            inventoryItemRepo.findById(code).ifPresent(item -> {
                item.setQuantity(item.getQuantity() + 1);
                inventoryItemRepo.save(item);
            });
        }

        currentRepo.deleteAllById(codesToProcess);

        persistentIssue.setIsReturned(true);

        IssuedItem savedIssue = issueRepo.save(persistentIssue);
        returnRequest.setIssuedItem(savedIssue);
        ReturnedItem savedReturn = returnedItemRepo.save(returnRequest);

        // ✅ Send return notification email
        try {
            String toEmail = persistentIssue.getIssuedToEmail();
            if (toEmail != null && !toEmail.isBlank()) {
                emailService.sendReturnNotification(
                        toEmail,
                        persistentIssue.getIssuedTo(),
                        persistentIssue.getItemName(),
                        persistentIssue.getItemCodesSnapshot(),
                        savedReturn.getReturnDate() != null ? savedReturn.getReturnDate().toString()
                                : LocalDate.now().toString(),
                        savedReturn.getConditionStatus() != null ? savedReturn.getConditionStatus() : "N/A");
            }
        } catch (Exception e) {
            System.err.println("Return email notification failed: " + e.getMessage());
        }
    }

}
package com.ims.server.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.ims.server.model.CurrentIssuedInventory;
import com.ims.server.model.IssuedItem;
import com.ims.server.model.Location;
import com.ims.server.model.ReturnedItem;
import com.ims.server.model.User;
import com.ims.server.repository.CurrentInventoryRepository;
import com.ims.server.repository.InventoryItemRepository;
import com.ims.server.repository.IssuedItemRepository;
import com.ims.server.repository.LocationRepository;
import com.ims.server.repository.ReturnedItemRepository;
import com.ims.server.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryIssueService {

    private final IssuedItemRepository issueRepo;
    private final CurrentInventoryRepository currentRepo;
    private final InventoryItemRepository inventoryItemRepo;
    private final ReturnedItemRepository returnedItemRepo;
    private final UserRepository userRepo;
    private final LocationRepository locationRepo;

    public List<String> getUniqueAvailableItemNames() {
        return inventoryItemRepo.findUniqueAvailableItemNames();
    }

    public List<String> getAvailableCodesByItemName(String itemName) {
        return inventoryItemRepo.findAvailableCodesByItemName(itemName);
    }

    @Transactional
    public IssuedItem issueItems(IssuedItem request) {
        if (request.getIssuedTo() == null || request.getIssuedTo().getEmail() == null) {
            throw new RuntimeException("Validation Error: Recipient email is required.");
        }

        String email = request.getIssuedTo().getEmail();
        User persistentUser = userRepo.findById(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found."));

        request.setIssuedTo(persistentUser);

        if (request.getLocation() != null) {
            Location persistentLocation = locationRepo.findById(request.getLocation().getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            request.setLocation(persistentLocation);
        }

        Set<String> requestedCodes = request.getItemCodes();
        if (requestedCodes == null || requestedCodes.isEmpty()) {
            throw new RuntimeException("Validation Error: At least one Item Code must be selected.");
        }

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
        request.setItemCodesSnapshot(String.join(",", requestedCodes));

        return issueRepo.save(request);
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
        // 1. Validation
        if (returnRequest.getIssuedItem() == null || returnRequest.getIssuedItem().getId() == null) {
            throw new RuntimeException("Validation Error: Issued Item ID is missing.");
        }

        // 2. Retrieve existing Issue
        Long issueId = returnRequest.getIssuedItem().getId();
        IssuedItem persistentIssue = getIssueById(issueId);

        if (Boolean.TRUE.equals(persistentIssue.getIsReturned())) {
            throw new RuntimeException("This item has already been marked as returned.");
        }

        // 3. Update Inventory Stock & Remove from Current (the blacklist table)
        Set<String> codesToProcess = persistentIssue.getItemCodes();

        for (String code : codesToProcess) {
            // Increment the main inventory quantity
            inventoryItemRepo.findById(code).ifPresent(item -> {
                item.setQuantity(item.getQuantity() + 1);
                inventoryItemRepo.save(item);
            });
        }

        // This makes the codes "Available" again for the next user to borrow
        currentRepo.deleteAllById(codesToProcess);

        // 4. Update Status (KEEP THE CODES IN THE COLLECTION FOR HISTORY)
        persistentIssue.setIsReturned(true);

        // We save the issue record without clearing its codes
        IssuedItem savedIssue = issueRepo.save(persistentIssue);

        // 5. Save Return History linked to the updated issue
        returnRequest.setIssuedItem(savedIssue);
        returnedItemRepo.save(returnRequest);
    }
}
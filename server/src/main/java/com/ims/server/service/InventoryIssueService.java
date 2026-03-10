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

        // 3. Update Inventory Stock & Remove from Current (Blacklist)
        // We capture the codes BEFORE clearing them from the record
        Set<String> codesToProcess = persistentIssue.getItemCodes();

        for (String code : codesToProcess) {
            // Increment inventory quantity
            inventoryItemRepo.findById(code).ifPresent(item -> {
                item.setQuantity(item.getQuantity() + 1);
                inventoryItemRepo.save(item);
            });
        }

        // Remove from the 'CurrentIssuedInventory' table so codes can be reused
        currentRepo.deleteAllById(codesToProcess);

        // 4. DELETE codes from the IssuedItem's collection table
        // This wipes the entries in the 'issued_item_codes' table for this ID
        persistentIssue.getItemCodes().clear();

        // 5. Update Status
        persistentIssue.setIsReturned(true);
        issueRepo.save(persistentIssue);

        // 6. Save Return History
        returnRequest.setIssuedItem(persistentIssue);
        returnedItemRepo.save(returnRequest);
    }
}
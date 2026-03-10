package com.ims.server.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * Fetch items available for the dropdown (Quantity > 0)
     */
    public List<String> getUniqueAvailableItemNames() {
        return inventoryItemRepo.findUniqueAvailableItemNames();
    }

    /**
     * Fetch specific codes for a chosen item name that aren't already issued
     */
    public List<String> getAvailableCodesByItemName(String itemName) {
        return inventoryItemRepo.findAvailableCodesByItemName(itemName);
    }

    @Transactional
    public IssuedItem issueItems(IssuedItem request) {

        String email = request.getIssuedTo().getEmail();

        User persistentUser = userRepo.findById(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found."));

        // 2. IMPORTANT: Replace the "loose" user object with the "managed" one
        request.setIssuedTo(persistentUser);

        // 3. Do the same for Location if it's a @ManyToOne relationship
        if (request.getLocation() != null) {
            Location persistentLocation = locationRepo.findById(request.getLocation().getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            request.setLocation(persistentLocation);
        }
        // 1. Validation: Ensure itemCodes are provided
        Set<String> requestedCodes = request.getItemCodes();
        if (requestedCodes == null || requestedCodes.isEmpty()) {
            throw new RuntimeException("Validation Error: At least one Item Code must be selected.");
        }

        // 2. Business Logic: Check if any requested code is already in use
        for (String code : requestedCodes) {
            if (currentRepo.existsById(code)) {
                throw new RuntimeException("Validation Error: Item Code '" + code + "' is already currently issued.");
            }
        }

        // 3. Update Inventory Stock & Status
        for (String code : requestedCodes) {
            // Mark as "Locked" in currently issued table
            currentRepo.save(new CurrentIssuedInventory(code));

            // Reduce quantity in the main inventory table for each specific unit
            inventoryItemRepo.findById(code).ifPresent(item -> {
                item.setQuantity(Math.max(0, item.getQuantity() - 1));
                inventoryItemRepo.save(item);
            });
        }

        // 4. Finalize the Record
        request.setIssueDate(LocalDate.now());
        request.setQuantity(requestedCodes.size()); // Auto-sync quantity to the number of items

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
    public void processReturn(ReturnedItem returnRequest) {
        if (returnRequest.getIssuedItem() == null || returnRequest.getIssuedItem().getId() == null) {
            throw new RuntimeException("Validation Error: Issued Item ID is missing.");
        }

        Long issueId = returnRequest.getIssuedItem().getId();
        IssuedItem persistentIssue = getIssueById(issueId);

        // 1. Update Inventory Quantity: Add back the stock
        Set<String> codesToReturn = persistentIssue.getItemCodes();
        for (String code : codesToReturn) {
            inventoryItemRepo.findById(code).ifPresent(item -> {
                item.setQuantity(item.getQuantity() + 1);
                inventoryItemRepo.save(item);
            });
        }

        // 2. Clear from Current Issued (Unlock the items)
        currentRepo.deleteAllById(codesToReturn);

        // 3. Save History
        returnRequest.setIssuedItem(persistentIssue);
        returnedItemRepo.save(returnRequest);

    }

    @Transactional
    public IssuedItem updateExpectedReturnDate(Long id, LocalDate newDate) {
        // 1. Find the existing record
        IssuedItem existingIssue = issueRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue record not found with ID: " + id));

        // 2. Optional: Check if the item is already returned
        if (existingIssue.isReturned()) {
            throw new RuntimeException("Cannot edit dates for a record that has already been returned.");
        }

        // 3. Update only the specific field
        existingIssue.setExpectedReturnDate(newDate);

        // 4. Save and return the updated entity
        return issueRepo.save(existingIssue);
    }

}
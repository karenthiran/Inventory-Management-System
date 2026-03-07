package com.ims.server.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.server.model.CurrentIssuedInventory;
import com.ims.server.model.InventoryItem;
import com.ims.server.model.IssuedItem;
import com.ims.server.model.ReturnedItem;
import com.ims.server.repository.CategoryRepository;
import com.ims.server.repository.CurrentInventoryRepository;
import com.ims.server.repository.InventoryItemRepository;
import com.ims.server.repository.IssuedItemRepository;
import com.ims.server.repository.ReturnedItemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryIssueService {

    private final IssuedItemRepository issueRepo;
    private final CurrentInventoryRepository currentRepo;
    private final CategoryRepository categoryRepo;
    // In InventoryIssueService.java
    private final InventoryItemRepository inventoryItemRepo;
    // Add this to your existing private final fields
    private final ReturnedItemRepository returnedItemRepo;

    public List<InventoryItem> getAvailableItems() {
        return inventoryItemRepo.findAllAvailableItems();
    }

    public List<InventoryItem> getAvailableItemsByCategory(String categoryId) {
        return inventoryItemRepo.findAvailableItemsByCategory(categoryId);
    }

    @Transactional
    public IssuedItem issueItems(IssuedItem request) {
        // 1. Validate Category exists
        if (request.getCategory() == null || request.getCategory().getCategoryId() == null) {
            throw new RuntimeException("Category ID is required.");
        }

        categoryRepo.findById(request.getCategory().getCategoryId())
                .orElseThrow(() -> new RuntimeException(
                        "Category not found with ID: " + request.getCategory().getCategoryId()));

        // 2. Business Logic: Check if any requested Item Code is already issued
        List<String> requestedCodes = request.getItemCodes();
        for (String code : requestedCodes) {
            if (currentRepo.existsById(code)) {
                throw new RuntimeException("Validation Error: Item Code '" + code + "' is already currently issued.");
            }
        }

        // 3. Save the Transaction Record
        IssuedItem savedIssue = issueRepo.save(request);

        // 4. Update the Status Table
        List<CurrentIssuedInventory> statusEntries = requestedCodes.stream()
                .map(code -> new CurrentIssuedInventory(code))
                .collect(Collectors.toList());

        currentRepo.saveAll(statusEntries);

        return savedIssue;
    }

    // --- NEW METHODS (Placed outside issueItems) ---

    public List<IssuedItem> getAllIssuedItems() {
        return issueRepo.findAll();
    }

    public IssuedItem getIssueById(Long id) {
        return issueRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue record not found with ID: " + id));
    }

    @Transactional
    public IssuedItem updateIssue(Long id, IssuedItem updatedDetails) {
        IssuedItem existingIssue = getIssueById(id);

        // Update metadata fields
        existingIssue.setIssuedTo(updatedDetails.getIssuedTo());
        existingIssue.setIssueDate(updatedDetails.getIssueDate()); // Good to include this too
        existingIssue.setDueDate(updatedDetails.getDueDate());
        existingIssue.setNotes(updatedDetails.getNotes());
        existingIssue.setQuantity(updatedDetails.getQuantity());
        existingIssue.setUsername(updatedDetails.getUsername());

        return issueRepo.save(existingIssue);
    }

    @Transactional
    public void returnItem(String itemCode) {
        if (!currentRepo.existsById(itemCode)) {
            throw new RuntimeException("Item Code " + itemCode + " is not currently marked as issued.");
        }
        currentRepo.deleteById(itemCode);
    }

    @Transactional
    public void returnMultipleItems(List<String> itemCodes) {
        // Optional: Validate if they exist first, or just perform the delete
        currentRepo.deleteAllById(itemCodes);
    }

    @Transactional
    public void processReturn(ReturnedItem returnRequest) {
        // 1. Extract ID safely
        if (returnRequest.getIssuedItem() == null || returnRequest.getIssuedItem().getId() == null) {
            throw new RuntimeException("Validation Error: Issued Item ID is missing.");
        }

        Long issueId = returnRequest.getIssuedItem().getId();

        // 2. Fetch the REAL entity from the DB
        IssuedItem persistentIssue = issueRepo.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Original issue record not found for ID: " + issueId));

        // 3. Link the REAL entity to the return request
        returnRequest.setIssuedItem(persistentIssue);

        // 4. Update the Issue status
        persistentIssue.setIsReturned(true);
        issueRepo.save(persistentIssue);

        // 5. Save Return History
        returnedItemRepo.save(returnRequest);

        // 6. Clear from current inventory
        if (persistentIssue.getItemCodes() != null) {
            currentRepo.deleteAllById(persistentIssue.getItemCodes());
        }
    }
}
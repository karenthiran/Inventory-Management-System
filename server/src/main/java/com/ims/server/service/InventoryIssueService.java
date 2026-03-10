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

    public List<String> getUniqueAvailableItemNames() {
        return inventoryItemRepo.findUniqueAvailableItemNames();
    }

    public List<String> getAvailableCodesByItemName(String itemName) {
        return inventoryItemRepo.findAvailableCodesByItemName(itemName);
    }

    @Transactional
    public IssuedItem issueItems(IssuedItem request) {
        // 1. Safe extraction of Email
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
                // Ensure we don't go below zero
                if (item.getQuantity() > 0) {
                    item.setQuantity(item.getQuantity() - 1);
                    inventoryItemRepo.save(item);
                }
            });
        }

        request.setIssueDate(LocalDate.now());
        request.setQuantity(requestedCodes.size());

        // Ensure isReturned is explicitly false on creation
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
    public void processReturn(ReturnedItem returnRequest) {
        if (returnRequest.getIssuedItem() == null || returnRequest.getIssuedItem().getId() == null) {
            throw new RuntimeException("Validation Error: Issued Item ID is missing.");
        }

        Long issueId = returnRequest.getIssuedItem().getId();
        IssuedItem persistentIssue = getIssueById(issueId);

        Set<String> codesToReturn = persistentIssue.getItemCodes();
        for (String code : codesToReturn) {
            inventoryItemRepo.findById(code).ifPresent(item -> {
                item.setQuantity(item.getQuantity() + 1);
                inventoryItemRepo.save(item);
            });
        }

        currentRepo.deleteAllById(codesToReturn);

        // Mark the record as returned
        persistentIssue.setIsReturned(true);
        issueRepo.save(persistentIssue);

        returnRequest.setIssuedItem(persistentIssue);
        returnedItemRepo.save(returnRequest);
    }

    @Transactional
    public IssuedItem updateExpectedReturnDate(Long id, LocalDate newDate) {
        IssuedItem existingIssue = issueRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue record not found with ID: " + id));

        // FIXED: Use getIsReturned() and add null check for Boolean object
        if (Boolean.TRUE.equals(existingIssue.getIsReturned())) {
            throw new RuntimeException("Cannot edit dates for a record that has already been returned.");
        }

        existingIssue.setExpectedReturnDate(newDate);

        return issueRepo.save(existingIssue);
    }
}
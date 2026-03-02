package com.ims.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.IssuedItem;
import com.ims.server.repository.IssuedItemRepository;

@RestController
@RequestMapping("/api/issued-items")
@CrossOrigin(origins = "${app.frontend.url}")
public class IssuedItemController {

    private final IssuedItemRepository issuedItemRepository;

    public IssuedItemController(IssuedItemRepository issuedItemRepository) {
        this.issuedItemRepository = issuedItemRepository;
    }

    // add new issued item
    @PostMapping("/add")
    public IssuedItem issueNewItem(@RequestBody IssuedItem issuedItem) {
        return issuedItemRepository.save(issuedItem);
    }

    // get all issued items
    @GetMapping("/all")
    public List<IssuedItem> getAllIssuedItems() {
        return issuedItemRepository.findAll();
    }

    // edit endpoints
    // 8. Update an existing issued item record
    @PutMapping("/update/{id}")
    public IssuedItem updateIssuedItem(@PathVariable Long id, @RequestBody IssuedItem updatedDetails) {
        // 1. Find the existing record in the database
        IssuedItem existingRecord = issuedItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue record not found with id: " + id));

        // 2. Update the fields with new data from the request body
        existingRecord.setItemName(updatedDetails.getItemName());
        existingRecord.setItemNumbers(updatedDetails.getItemNumbers());
        existingRecord.setQuantity(updatedDetails.getQuantity());
        existingRecord.setIssuedTo(updatedDetails.getIssuedTo());
        existingRecord.setIssueDate(updatedDetails.getIssueDate());
        existingRecord.setDueDate(updatedDetails.getDueDate());
        existingRecord.setNotes(updatedDetails.getNotes());

        // 3. Save the updated record (JPA handles the SQL UPDATE)
        return issuedItemRepository.save(existingRecord);
    }
}

package com.ims.server.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.IssuedItem;
import com.ims.server.service.InventoryIssueService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}") // Adjust this for your production security
public class IssuedItemController {

    private final InventoryIssueService issueService;

    /**
     * 1. Get unique item names for the 'Item Name' dropdown.
     * Only returns names that have stock > 0 in inventory.
     */
    @GetMapping("/unique-items")
    public ResponseEntity<List<String>> getUniqueItemNames() {
        return ResponseEntity.ok(issueService.getUniqueAvailableItemNames());
    }

    /**
     * 2. Get available codes for a specific item name.
     * Filters out any codes currently marked as 'Issued'.
     */
    @GetMapping("/available-codes/{itemName}")
    public ResponseEntity<List<String>> getAvailableCodes(@PathVariable String itemName) {
        return ResponseEntity.ok(issueService.getAvailableCodesByItemName(itemName));
    }

    /**
     * 3. Create a new Issue Record.
     * This handles multi-item codes, stock reduction, and status locking.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createIssue(@RequestBody IssuedItem issueRequest) {
        try {
            IssuedItem savedIssue = issueService.issueItems(issueRequest);
            return ResponseEntity.ok(savedIssue);
        } catch (RuntimeException e) {
            // Returns the business logic validation errors (e.g., "Item already issued")
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }

    /**
     * 4. Get all issued items for the 'Currently Issued' table/report.
     */
    @GetMapping("/all")
    public ResponseEntity<List<IssuedItem>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssuedItems());
    }

    /**
     * 5. Get a specific issue by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<IssuedItem> getIssueById(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    /**
     * 6. Update the expected return date for an active issue.
     */
    @PutMapping("/{id}/update-date")
    public ResponseEntity<?> updateReturnDate(
            @PathVariable Long id,
            @RequestParam LocalDate newDate) {
        try {
            IssuedItem updatedIssue = issueService.updateExpectedReturnDate(id, newDate);
            return ResponseEntity.ok(updatedIssue);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}
package com.ims.server.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.InventoryItem;
import com.ims.server.model.IssuedItem;
import com.ims.server.service.InventoryIssueService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventory/issue") // Keep the base path
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class InventoryIssueController {

    private final InventoryIssueService issueService;

    // Change "/add" to "/issue" to resolve the ambiguity
    @PostMapping("/issue")
    public ResponseEntity<?> createIssueRecord(@RequestBody IssuedItem issueRequest) {
        try {
            IssuedItem result = issueService.issueItems(issueRequest);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 1. GET all issued items
    @GetMapping("/all")
    public ResponseEntity<List<IssuedItem>> getAll() {
        return ResponseEntity.ok(issueService.getAllIssuedItems());
    }

    // 2. GET a single issue by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(issueService.getIssueById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // 3. PUT (Update) an existing issue
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody IssuedItem details) {
        try {
            IssuedItem updated = issueService.updateIssue(id, details);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 1. GET all items that are NOT currently issued
    @GetMapping("/available")
    public ResponseEntity<List<InventoryItem>> getAvailable() {
        return ResponseEntity.ok(issueService.getAvailableItems());
    }

    // 2. GET available items filtered by a specific category
    @GetMapping("/available/category/{catId}")
    public ResponseEntity<List<InventoryItem>> getAvailableByCat(@PathVariable String catId) {
        return ResponseEntity.ok(issueService.getAvailableItemsByCategory(catId));
    }
}
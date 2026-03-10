package com.ims.server.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.CurrentIssuedInventory;
import com.ims.server.repository.CurrentInventoryRepository;
import com.ims.server.service.InventoryIssueService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventory/status")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class CurrentStatusController {

    private final CurrentInventoryRepository currentRepo;
    private final InventoryIssueService issueService;

    // 1. GET all currently issued item codes (The "Blacklist")
    @GetMapping("/all")
    public ResponseEntity<List<CurrentIssuedInventory>> getAllIssuedCodes() {
        return ResponseEntity.ok(currentRepo.findAll());
    }

    // // 3. DELETE multiple items at once
    // @DeleteMapping("/return-bulk")
    // public ResponseEntity<?> returnMultipleItems(@RequestBody List<String>
    // itemCodes) {
    // try {
    // issueService.returnMultipleItems(itemCodes);
    // return ResponseEntity.ok("Items " + itemCodes + " successfully returned.");
    // } catch (RuntimeException e) {
    // return ResponseEntity.badRequest().body("Error returning items: " +
    // e.getMessage());
    // }
    // }
}
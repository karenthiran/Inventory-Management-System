package com.ims.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.ReturnedItem;
import com.ims.server.repository.ReturnedItemRepository;
import com.ims.server.service.InventoryIssueService;

@RestController
@RequestMapping("/api/inventory/issue")
@CrossOrigin(origins = "*")
public class ReturnController {

    @Autowired
    private ReturnedItemRepository returnedItemRepo;

    // FIX: Inject the service here
    @Autowired
    private InventoryIssueService issueService;

    @GetMapping("/returns")
    public ResponseEntity<List<ReturnedItem>> getAllReturns() {
        List<ReturnedItem> returns = returnedItemRepo.findAllByOrderByReturnDateDesc();
        return ResponseEntity.ok(returns);
    }

    @PostMapping("/return")
    public ResponseEntity<?> completeReturn(@RequestBody ReturnedItem payload) {
        try {
            // Now this will work because issueService is injected
            issueService.processReturn(payload);
            return ResponseEntity.ok("Item returned successfully and inventory updated.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

package com.ims.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.ReturnedItem;
import com.ims.server.repository.ReturnedItemRepository;

@RestController
@RequestMapping("/api/inventory/issue")
@CrossOrigin(origins = "*") // Allows your React frontend to connect
public class ReturnController {

    @Autowired
    private ReturnedItemRepository returnedItemRepo;

    /**
     * Fetches all returned items to display in the Return Management table.
     */
    @GetMapping("/returns")
    public ResponseEntity<List<ReturnedItem>> getAllReturns() {
        List<ReturnedItem> returns = returnedItemRepo.findAllByOrderByReturnDateDesc();
        return ResponseEntity.ok(returns);
    }
}
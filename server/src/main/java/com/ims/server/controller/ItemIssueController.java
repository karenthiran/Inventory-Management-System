package com.ims.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.ItemIssue;
import com.ims.server.service.ItemIssueService;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "${app.frontend.url}")
public class ItemIssueController {

    @Autowired
    private ItemIssueService service;

    @PostMapping
    public ItemIssue create(@RequestBody ItemIssue issue) {
        return service.createIssue(issue);
    }

    @GetMapping
    public List<ItemIssue> getAll() {
        return service.getAllIssues();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemIssue> getById(@PathVariable Long id) {
        return service.getIssueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemIssue> update(@PathVariable Long id, @RequestBody ItemIssue details) {
        return ResponseEntity.ok(service.updateIssue(id, details));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }
}
package com.ims.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.server.model.ItemIssue;
import com.ims.server.repository.ItemIssueRepository;

@Service
public class ItemIssueService {

    @Autowired
    private ItemIssueRepository repository;

    @Transactional
    public ItemIssue createIssue(ItemIssue issue) {
        // Ensure each child code knows who its parent is
        if (issue.getItemCodes() != null) {
            issue.getItemCodes().forEach(code -> code.setItemIssue(issue));
        }
        return repository.save(issue);
    }

    public List<ItemIssue> getAllIssues() {
        return repository.findAll();
    }

    public Optional<ItemIssue> getIssueById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public ItemIssue updateIssue(Long id, ItemIssue details) {
        return repository.findById(id).map(existing -> {
            existing.setItemName(details.getItemName());
            existing.setQuantity(details.getQuantity());
            existing.setIssuedTo(details.getIssuedTo());
            existing.setIssueDate(details.getIssueDate());
            existing.setDueDate(details.getDueDate());
            existing.setNotes(details.getNotes());

            // Handle updating nested item codes
            existing.getItemCodes().clear();
            if (details.getItemCodes() != null) {
                details.getItemCodes().forEach(code -> {
                    code.setItemIssue(existing);
                    existing.getItemCodes().add(code);
                });
            }
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Issue not found with id " + id));
    }

    public void deleteIssue(Long id) {
        repository.deleteById(id);
    }
}
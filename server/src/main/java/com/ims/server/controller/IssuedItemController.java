package com.ims.server.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
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

}

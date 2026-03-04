package com.ims.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.ItemType;
import com.ims.server.repository.ItemTypeRepository;

@RestController
@RequestMapping("api/itemtypes")
@CrossOrigin(origins = "${app.frontend.url}")
public class ItemTypeController {

    private final ItemTypeRepository itemTypeRepository;

    public ItemTypeController(ItemTypeRepository itemTypeRepository) {
        this.itemTypeRepository = itemTypeRepository;
    }

    @PostMapping("/add")
    public ItemType cretaItemType(@RequestBody ItemType itemType) {

        if (itemTypeRepository.existsById(itemType.getTypeId())) {
            throw new RuntimeException(
                    "Item Type ID " + itemType.getTypeId() + " already exists. Cannot add duplicate.");
        }

        return itemTypeRepository.save(itemType);
    }

    @GetMapping("/all")
    public List<ItemType> getAllItemTypes() {
        return itemTypeRepository.findAll();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteItemType(@PathVariable String id) {
        if (!itemTypeRepository.existsById(id)) {
            throw new RuntimeException("Item Type not found with id: " + id);
        }
        itemTypeRepository.deleteById(id);
        return "Item Type with ID " + id + " has been deleted.";
    }

}

package com.ims.server.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.Category;
import com.ims.server.model.InventoryItem;
import com.ims.server.model.Location;
import com.ims.server.repository.CategoryRepository;
import com.ims.server.repository.InventoryItemRepository;
import com.ims.server.repository.LocationRepository;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "${app.frontend.url}")
public class InventoryItemController {

    public final InventoryItemRepository inventoryItemRepository;
    public final CategoryRepository categoryRepository;
    public final LocationRepository locationRepository;

    public InventoryItemController(InventoryItemRepository inventoryItemRepository,
            CategoryRepository categoryRepository, LocationRepository locationRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
    }

    // add the repositories for Category and Location
    // add new items
    @PostMapping("/add")
    public InventoryItem addItem(@RequestBody InventoryItem item) {
        // 1. Fetch the actual Category from DB using the ID sent from frontend
        Category category = categoryRepository.findById(item.getCategory().getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 2. Fetch the actual Location from DB
        Location location = locationRepository.findById(item.getLocation().getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        // 3. Attach the REAL database-managed objects to the item
        item.setCategory(category);
        item.setLocation(location);

        // 4. Now save the item
        return inventoryItemRepository.save(item);
    }

}

package com.ims.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.Category;
import com.ims.server.model.InventoryItem;
import com.ims.server.model.ItemType;
import com.ims.server.model.Location;
import com.ims.server.repository.CategoryRepository;
import com.ims.server.repository.CurrentInventoryRepository;
import com.ims.server.repository.InventoryItemRepository;
import com.ims.server.repository.ItemTypeRepository;
import com.ims.server.repository.LocationRepository;
import com.ims.server.repository.MaintenanceRepository;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "${app.frontend.url}")
public class InventoryItemController {

        public final InventoryItemRepository inventoryItemRepository;
        public final CategoryRepository categoryRepository;
        public final LocationRepository locationRepository;
        public final ItemTypeRepository itemTypeRepository;
        private final CurrentInventoryRepository currentInventoryRepository;
        private final MaintenanceRepository maintenanceRepository;

        public InventoryItemController(InventoryItemRepository inventoryItemRepository,
                        CategoryRepository categoryRepository, LocationRepository locationRepository,
                        ItemTypeRepository itemTypeRepository, CurrentInventoryRepository currentInventoryRepository,
                        MaintenanceRepository maintenanceRepository) {
                this.inventoryItemRepository = inventoryItemRepository;
                this.categoryRepository = categoryRepository;
                this.locationRepository = locationRepository;
                this.itemTypeRepository = itemTypeRepository;
                this.currentInventoryRepository = currentInventoryRepository;
                this.maintenanceRepository = maintenanceRepository;
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

                ItemType itemType = itemTypeRepository.findById(item.getItemType().getTypeId())
                                .orElseThrow(() -> new RuntimeException("Item Type not found"));

                // 3. Attach the REAL database-managed objects to the item
                item.setCategory(category);
                item.setLocation(location);
                item.setItemType(itemType);

                // 4. Now save the item
                return inventoryItemRepository.save(item);
        }

        // get all items
        @GetMapping("/all")
        public List<InventoryItem> getAllItems() {
                List<InventoryItem> items = inventoryItemRepository.findAll();

                for (InventoryItem item : items) {
                        String code = item.getItemCode();

                        if (maintenanceRepository.existsByItemCode(code)) {
                                item.setStatus("Maintenance");
                        } else if (currentInventoryRepository.existsByItemCode(code)) {
                                item.setStatus("Not Available");
                        } else {
                                item.setStatus("Available");
                        }
                }
                return items;
        }

        // update an item
        @PutMapping("/update/{code}")
        public InventoryItem updatItem(@PathVariable String code, @RequestBody InventoryItem itemDetails) {
                // Find the existing item by code
                InventoryItem existingItem = inventoryItemRepository.findById(code)
                                .orElseThrow(() -> new RuntimeException("Item not found"));

                // Refatch the code to use the existing item and update its fields
                // 2. Re-fetch Category and Location to ensure they are persistent (managed)
                // objects
                Category category = categoryRepository.findById(itemDetails.getCategory().getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));
                Location location = locationRepository.findById(itemDetails.getLocation().getLocationId())
                                .orElseThrow(() -> new RuntimeException("Location not found"));
                ItemType itemType = itemTypeRepository.findById(itemDetails.getItemType().getTypeId())
                                .orElseThrow(() -> new RuntimeException("Item Type not found"));

                // 3. Update the existing item with new details
                existingItem.setItemName(itemDetails.getItemName());
                existingItem.setQuantity(itemDetails.getQuantity());
                existingItem.setDescription(itemDetails.getDescription());
                existingItem.setItemType(itemType);
                existingItem.setCategory(category);
                existingItem.setLocation(location);

                // save the updated item
                return inventoryItemRepository.save(existingItem);
        }

        // Delete an item
        @DeleteMapping("/delete/{code}")
        public String deleteItem(@PathVariable String code) {
                // check if the item exists
                if (!inventoryItemRepository.existsById(code)) {
                        throw new RuntimeException("Item not found with code: " + code);
                }

                // perform deletion
                inventoryItemRepository.deleteById(code);

                return "Item with code " + code + " has been deleted successfully.";
        }

}

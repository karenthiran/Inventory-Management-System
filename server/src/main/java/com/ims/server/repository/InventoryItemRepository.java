package com.ims.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ims.server.model.InventoryItem;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {

        // This query selects all items where the item_code is NOT in the status table
        @Query("SELECT i FROM InventoryItem i WHERE i.itemCode NOT IN " +
                        "(SELECT c.itemCode FROM CurrentIssuedInventory c)")
        List<InventoryItem> findAllAvailableItems();

        // Optional: Filter by Category too for your dropdown logic
        @Query("SELECT i FROM InventoryItem i WHERE i.category.categoryId = :catId " +
                        "AND i.itemCode NOT IN (SELECT c.itemCode FROM CurrentIssuedInventory c)")
        List<InventoryItem> findAvailableItemsByCategory(String catId);

        /**
         * 1. Get unique item names for the first dropdown.
         * Only shows items that have at least 1 unit in stock.
         */
        @Query("SELECT DISTINCT i.itemName FROM InventoryItem i WHERE i.quantity > 0")
        List<String> findUniqueAvailableItemNames();

        /**
         * 2. Get available item codes for a selected item name.
         * Filters out codes that exist in the 'current_issued_inventory' table.
         */
        @Query("SELECT i.itemCode FROM InventoryItem i " +
                        "WHERE i.itemName = :itemName " +
                        "AND i.itemCode NOT IN (SELECT c.itemCode FROM CurrentIssuedInventory c)")
        List<String> findAvailableCodesByItemName(@Param("itemName") String itemName);

        /**
         * 3. Optional: Get all items belonging to a specific category (if still needed
         * for reports)
         */
        @Query("SELECT i FROM InventoryItem i WHERE i.category.categoryId = :categoryId")
        List<InventoryItem> findByCategoryId(@Param("categoryId") String categoryId);
}
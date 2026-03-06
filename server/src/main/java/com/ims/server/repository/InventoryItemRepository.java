package com.ims.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}
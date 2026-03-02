package com.ims.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.InventoryItem;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {

}

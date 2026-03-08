package com.ims.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.CurrentIssuedInventory;

@Repository
public interface CurrentInventoryRepository extends JpaRepository<CurrentIssuedInventory, String> {
    // Check if an item is already out before issuing
    boolean existsByItemCode(String itemCode);
}
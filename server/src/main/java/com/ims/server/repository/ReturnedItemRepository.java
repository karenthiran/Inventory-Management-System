package com.ims.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.ReturnedItem;

@Repository
public interface ReturnedItemRepository extends JpaRepository<ReturnedItem, Long> {
    // This auto-generates the SQL to sort by date (newest first)
    List<ReturnedItem> findAllByOrderByReturnDateDesc();
}
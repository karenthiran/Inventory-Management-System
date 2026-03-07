package com.ims.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.ReturnedItem;

@Repository
public interface ReturnedItemRepository extends JpaRepository<ReturnedItem, Long> {
}
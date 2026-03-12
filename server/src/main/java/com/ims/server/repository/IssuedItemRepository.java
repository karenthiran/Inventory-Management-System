package com.ims.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ims.server.model.IssuedItem;

@Repository
public interface IssuedItemRepository extends JpaRepository<IssuedItem, Long> {

    // ✅ issuedTo is now a plain String — no more User object
    List<IssuedItem> findByIssuedTo(String issuedTo);

    List<IssuedItem> findByIssuedBy(String issuedBy);

    List<IssuedItem> findByItemName(String itemName);

    @Query("SELECT i FROM IssuedItem i WHERE i.itemCodesSnapshot LIKE %:itemCode%")
    List<IssuedItem> findIssuesBySpecificCode(@Param("itemCode") String itemCode);

    List<IssuedItem> findByIsReturnedFalse();

    List<IssuedItem> findAll();

    // ✅ issuedTo is a plain string now — delete by username directly
}
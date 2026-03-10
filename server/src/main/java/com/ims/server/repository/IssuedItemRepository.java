package com.ims.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ims.server.model.IssuedItem;
import com.ims.server.model.User;

@Repository
public interface IssuedItemRepository extends JpaRepository<IssuedItem, Long> {

    /**
     * Find all issues for a specific user (Receiver)
     */
    List<IssuedItem> findByIssuedTo(User issuedTo);

    /**
     * Find all issues performed by a specific staff member (Issuer)
     */
    List<IssuedItem> findByIssuedBy(String issuedBy);

    /**
     * Find issues by the specific item name from the inventory
     */
    List<IssuedItem> findByItemName(String itemName);

    /**
     * Custom Search: Find which issue record contains a specific physical item code
     * Useful for tracking history of a single unit.
     */
    @Query("SELECT i FROM IssuedItem i JOIN i.itemCodes c WHERE c = :itemCode")
    List<IssuedItem> findIssuesBySpecificCode(@Param("itemCode") String itemCode);

    // Fetches only items that are still out with users
    List<IssuedItem> findByIsReturnedFalse();

    // Fetches everything (what you are using now)
    List<IssuedItem> findAll();
}
package com.ims.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ims.server.model.IssuedItem;
import com.ims.server.model.User;

@Repository
public interface IssuedItemRepository extends JpaRepository<IssuedItem, Long> {

    List<IssuedItem> findByIssuedTo(User issuedTo);

    List<IssuedItem> findByIssuedBy(String issuedBy);

    List<IssuedItem> findByItemName(String itemName);

    // ✅ itemCodes @ElementCollection is removed — search snapshot string instead
    @Query("SELECT i FROM IssuedItem i WHERE i.itemCodesSnapshot LIKE %:itemCode%")
    List<IssuedItem> findIssuesBySpecificCode(@Param("itemCode") String itemCode);

    List<IssuedItem> findByIsReturnedFalse();

    List<IssuedItem> findAll();

    @Modifying
    @Query("DELETE FROM IssuedItem i WHERE i.issuedTo.email = :email")
    void deleteByIssuedToEmail(@Param("email") String email);
}
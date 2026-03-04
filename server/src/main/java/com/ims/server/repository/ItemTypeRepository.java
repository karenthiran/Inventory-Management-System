package com.ims.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.ItemType;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, String> {

}

package com.ims.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

}

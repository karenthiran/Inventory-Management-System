package com.ims.server.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.Category;
import com.ims.server.repository.CategoryRepository;

@RestController
@RequestMapping("api/categories")
@CrossOrigin(origins = "http://localhost:8080")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostMapping("/add")
    public Category createCategory(@RequestBody Category category) {
        // This takes the JSON from the user and saves it to the DB
        return categoryRepository.save(category);
    }
}

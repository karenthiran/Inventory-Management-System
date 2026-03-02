package com.ims.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.Category;
import com.ims.server.repository.CategoryRepository;

@RestController
@RequestMapping("api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        // This talks to the database and returns the whole list
        return categoryRepository.findAll();
    }

    @PostMapping("/add")
    public Category createCategory(@RequestBody Category category) {
        // This takes the JSON from the user and saves it to the DB
        return categoryRepository.save(category);
    }

    // Update an existing category
    @PutMapping("/update/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category categoryDetails) {
        // find the category by id
        Category exisitingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // update the category details
        exisitingCategory.setCategoryName(categoryDetails.getCategoryName());

        // save the updated category back to the database
        return categoryRepository.save(exisitingCategory);
    }

    // delete a category
    @DeleteMapping("/delete/{id}")
    public String deleteCategory(@PathVariable String id) {

        // check if the category exists
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }

        // delete the category
        categoryRepository.deleteById(id);

        return "Category with id: " + id + " has been deleted successfully.";
    }
}

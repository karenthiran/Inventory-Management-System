package com.ims.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    // Use double quotes inside the name attribute to match
    // case-sensitive columns in PostgreSQL exactly
    @Column(name = "\"categoryName\"", nullable = false, length = 255)
    private String categoryName;
}
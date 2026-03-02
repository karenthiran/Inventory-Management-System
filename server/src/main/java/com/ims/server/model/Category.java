package com.ims.server.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories") 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @Column(length = 30)
    private String id;

    @Column(name = "categoryName", nullable = false, length = 255)
    private String categoryName;
}
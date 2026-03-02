package com.ims.server.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "issued_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssuedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issue_id")
    private Long issueId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_numbers", nullable = false, columnDefinition = "TEXT")
    private String itemNumbers;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "issued_to", length = 100, nullable = false)
    private String issuedTo;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String notes;
}

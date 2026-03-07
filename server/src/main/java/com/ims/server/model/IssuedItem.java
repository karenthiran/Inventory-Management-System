package com.ims.server.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    private Long id;

    // Connects to your Category model
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "processed_by_user", nullable = false) // Optional: custom column name
    private String username;

    // Stores the multiple item codes selected in the UI
    @ElementCollection
    @CollectionTable(name = "issued_item_codes", joinColumns = @JoinColumn(name = "issue_id"))
    @Column(name = "item_code")
    private List<String> itemCodes;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "issued_to", nullable = false)
    private String issuedTo; // Maps to "Issue To (User / Lab)"

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_returned", nullable = false)
    private boolean isReturned = false;
}
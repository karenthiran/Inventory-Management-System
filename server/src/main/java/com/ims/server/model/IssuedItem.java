package com.ims.server.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
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

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "issued_by", nullable = false)
    private String issuedBy;

    @Column(name = "item_codes_snapshot", columnDefinition = "TEXT")
    private String itemCodesSnapshot;

    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    private User issuedTo;

    @ManyToOne
    @JoinColumn(name = "location_id", referencedColumnName = "location_id", nullable = false)
    private Location location;

    // This should match the size of itemCodes list automatically in your logic
    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expected_return_date")
    private LocalDate expectedReturnDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // In IssuedItem.java
    @Column(name = "is_returned", nullable = false)
    private Boolean isReturned = false; // Default to false for new issues

    // Add this annotation to ensure the JSON matches your Frontend mapping
    @JsonProperty("isReturned")
    public Boolean getIsReturned() {
        return isReturned;
    }
}
package com.ims.server.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "item_issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long issueId;

    private String itemName;
    private Integer quantity;
    private String issuedTo;

    private LocalDate issueDate;
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // One Issue can have many Item Codes
    @OneToMany(mappedBy = "itemIssue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IssueItemCode> itemCodes = new ArrayList<>();

    // Helper method to sync the relationship
    public void addItemCode(String code) {
        IssueItemCode itemCodeEntry = new IssueItemCode();
        itemCodeEntry.setItemCode(code);
        itemCodeEntry.setItemIssue(this);
        this.itemCodes.add(itemCodeEntry);
    }
}
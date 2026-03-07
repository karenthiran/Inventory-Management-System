package com.ims.server.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "returned_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "issue_id", nullable = false, unique = true)
    private IssuedItem issuedItem;

    @Column(name = "return_date", nullable = false)
    private LocalDate returnDate;

    @Column(name = "returned_by", nullable = false)
    private String returnedBy;

    @Column(columnDefinition = "TEXT")
    private String conditionStatus;

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
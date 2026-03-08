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
@Table(name = "maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_code", nullable = false, length = 50)
    private String itemCode;

    @Column(name = "item_type", length = 100)
    private String itemType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "received_from", nullable = false, length = 100)
    private String receivedFrom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(length = 50)
    private String status = "PENDING";
}
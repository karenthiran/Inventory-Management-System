package com.ims.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "current_issued_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentIssuedInventory {

    @Id
    @Column(name = "item_code", length = 50)
    private String itemCode;
}
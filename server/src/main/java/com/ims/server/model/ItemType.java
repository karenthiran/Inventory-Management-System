package com.ims.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "itemtype")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemType {

    @Id
    @Column(name = "type_id")
    private String typeId;

    @Column(name = "type_name", nullable = false)
    private String typeName;
}

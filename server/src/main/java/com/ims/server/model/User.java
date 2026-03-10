package com.ims.server.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") // Maps to your PostgreSQL table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "username", length = 255)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "role", length = 50)
    private String role; // Values: SUPER_ADMIN, ADMIN, USER

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "locationid", referencedColumnName = "location_id")
    private Location location;

    @Column(name = "createdat", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
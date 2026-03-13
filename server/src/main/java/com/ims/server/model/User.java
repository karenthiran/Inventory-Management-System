package com.ims.server.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
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
    private String role; // Values: SUPER_ADMIN, ADMIN, HOD, USER

    @Column(name = "createdat", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "must_change_password", nullable = false, columnDefinition = "boolean default true")
    private Boolean mustChangePassword = true;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
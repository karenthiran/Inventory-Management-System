package com.ims.server.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Used for Login and Password Reset verification
    Optional<User> findByEmail(String email);

    // ADD THIS: Used in /forgot-password to check if the user exists
    boolean existsByEmail(String email);
}
package com.ims.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.ActiveMaintenance;

@Repository
public interface ActiveMaintenanceRepository extends JpaRepository<ActiveMaintenance, String> {
    boolean existsByItemCode(String itemCode);
}
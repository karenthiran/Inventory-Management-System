package com.ims.server.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.ActiveMaintenance;
import com.ims.server.model.Maintenance;
import com.ims.server.repository.ActiveMaintenanceRepository;
import com.ims.server.repository.MaintenanceRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "${app.frontend.url}")
public class MaintenanceController {

    private final MaintenanceRepository maintenanceRepository;
    private final ActiveMaintenanceRepository activeMaintenanceRepository;

    public MaintenanceController(
            MaintenanceRepository maintenanceRepository,
            ActiveMaintenanceRepository activeMaintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.activeMaintenanceRepository = activeMaintenanceRepository;
    }

    // Add a new Maintenance Request
    // Also saves itemCode to active_maintenance table
    @PostMapping("/add")
    @Transactional
    public ResponseEntity<?> createRequest(@RequestBody Maintenance maintenance) {
        if (maintenance.getRequestDate() == null) {
            maintenance.setRequestDate(java.time.LocalDate.now());
        }

        // Force status to PENDING on creation
        maintenance.setStatus("PENDING");

        Maintenance saved = maintenanceRepository.save(maintenance);

        // ✅ Track in active_maintenance table
        activeMaintenanceRepository.save(new ActiveMaintenance(saved.getItemCode()));

        return ResponseEntity.ok(saved);
    }

    // Get all Maintenance Requests
    @GetMapping("/all")
    public List<Maintenance> getAllRequests() {
        return maintenanceRepository.findAll();
    }

    // Update status — enforces one-way flow: PENDING → IN_PROGRESS → COMPLETED
    // COMPLETED removes from active_maintenance and cannot be reversed
    @PutMapping("/update-status/{id}")
    @Transactional
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");

        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        String currentStatus = maintenance.getStatus();

        // ✅ Enforce one-way status flow — cannot go backwards
        if (!isValidTransition(currentStatus, newStatus)) {
            return ResponseEntity.badRequest()
                    .body("Invalid status transition: " + currentStatus + " → " + newStatus);
        }

        maintenance.setStatus(newStatus);
        Maintenance saved = maintenanceRepository.save(maintenance);

        // ✅ On COMPLETED — remove from active_maintenance (item available again)
        if ("COMPLETED".equals(newStatus)) {
            activeMaintenanceRepository.deleteById(saved.getItemCode());
        }

        return ResponseEntity.ok(saved);
    }

    // Edit full details — only allowed if status is PENDING
    @PutMapping("/edit/{id}")
    @Transactional
    public ResponseEntity<?> editMaintenanceDetails(
            @PathVariable Long id,
            @RequestBody Maintenance updatedMaintenance) {

        return maintenanceRepository.findById(id).map(existingRecord -> {
            // ✅ Only allow editing if still PENDING
            if (!"PENDING".equals(existingRecord.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Cannot edit a record that is already " + existingRecord.getStatus());
            }

            // If item code changed, update active_maintenance too
            String oldCode = existingRecord.getItemCode();
            String newCode = updatedMaintenance.getItemCode();
            if (!oldCode.equals(newCode)) {
                activeMaintenanceRepository.deleteById(oldCode);
                activeMaintenanceRepository.save(new ActiveMaintenance(newCode));
            }

            existingRecord.setItemName(updatedMaintenance.getItemName());
            existingRecord.setItemCode(newCode);
            existingRecord.setItemType(updatedMaintenance.getItemType());
            existingRecord.setQuantity(updatedMaintenance.getQuantity());
            existingRecord.setReceivedFrom(updatedMaintenance.getReceivedFrom());
            existingRecord.setDescription(updatedMaintenance.getDescription());
            existingRecord.setRequestDate(updatedMaintenance.getRequestDate());
            // ✅ Don't allow status change through edit endpoint
            // status only changes through /update-status

            return ResponseEntity.ok(maintenanceRepository.save(existingRecord));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Valid transitions: PENDING→IN_PROGRESS, IN_PROGRESS→COMPLETED only
    private boolean isValidTransition(String current, String next) {
        if ("PENDING".equals(current) && "IN_PROGRESS".equals(next))
            return true;
        if ("IN_PROGRESS".equals(current) && "COMPLETED".equals(next))
            return true;
        return false;
    }

    @GetMapping("/active-codes")
    public List<String> getActiveMaintenanceCodes() {
        return activeMaintenanceRepository.findAll()
                .stream()
                .map(ActiveMaintenance::getItemCode)
                .collect(java.util.stream.Collectors.toList());
    }
}
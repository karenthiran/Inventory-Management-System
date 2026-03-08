package com.ims.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.Maintenance;
import com.ims.server.repository.MaintenanceRepository;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "${app.frontend.url}")
public class MaintenanceController {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceController(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    // Add a new Maintenance Request
    @PostMapping("/add")
    public Maintenance createRequest(@RequestBody Maintenance maintenance) {
        // request_date will default to CURRENT_DATE in DB if not provided,
        // or you can set it manually here:
        if (maintenance.getRequestDate() == null) {
            maintenance.setRequestDate(java.time.LocalDate.now());
        }

        return maintenanceRepository.save(maintenance);
    }

    // Get all Maintenance Requests (useful for your admin table)
    @GetMapping("/all")
    public List<Maintenance> getAllRequests() {
        return maintenanceRepository.findAll();
    }

    // Update only the status of a maintenance request
    @PutMapping("/update-status/{id}")
    public Maintenance updateStatus(@PathVariable Long id, @RequestBody String newStatus) {
        // 1. Find the existing request
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found with id: " + id));

        // 2. Update the status
        // Note: If sending raw text from frontend, strip quotes if necessary
        maintenance.setStatus(newStatus.replace("\"", ""));

        // 3. Save and return
        return maintenanceRepository.save(maintenance);
    }

    // 4. Edit full details of a maintenance request
    @PutMapping("/edit/{id}")
    public Maintenance editMaintenanceDetails(@PathVariable Long id, @RequestBody Maintenance updatedMaintenance) {
        // 1. Find the existing record
        return maintenanceRepository.findById(id).map(existingRecord -> {
            // 2. Update all allowed fields
            existingRecord.setItemName(updatedMaintenance.getItemName());
            existingRecord.setItemCode(updatedMaintenance.getItemCode());
            existingRecord.setItemType(updatedMaintenance.getItemType());
            existingRecord.setQuantity(updatedMaintenance.getQuantity());
            existingRecord.setReceivedFrom(updatedMaintenance.getReceivedFrom());
            existingRecord.setDescription(updatedMaintenance.getDescription());
            existingRecord.setRequestDate(updatedMaintenance.getRequestDate());
            existingRecord.setStatus(updatedMaintenance.getStatus());

            // 3. Save the changes
            return maintenanceRepository.save(existingRecord);
        }).orElseThrow(() -> new RuntimeException("Maintenance record not found with id: " + id));
    }

}
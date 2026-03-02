package com.ims.server.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
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

}
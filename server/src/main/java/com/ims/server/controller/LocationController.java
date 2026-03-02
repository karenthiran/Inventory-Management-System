package com.ims.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.model.Location;
import com.ims.server.repository.LocationRepository;

@RestController
@RequestMapping("api/locations")
@CrossOrigin(origins = "${app.frontend.url}")
public class LocationController {

    private final LocationRepository locationRepository;

    public LocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @PostMapping("/add")
    public Location createLoaction(@RequestBody Location location) {
        // this takes the JSON from the user and saves it to the DB
        return locationRepository.save(location);
    }

    @GetMapping("/all")
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

}

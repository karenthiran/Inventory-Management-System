package com.ims.server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    // get all locations
    @GetMapping("/all")
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    // update an existing location
    @PutMapping("/update/{id}")
    public Location updateLocation(@PathVariable String id, @RequestBody Location locationDetails) {

        // find the location by id
        Location exisitingLocation = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));

        // update the location details
        exisitingLocation.setLocationName(locationDetails.getLocationName());

        // save the updated location back to the database
        return locationRepository.save(exisitingLocation);
    }

    // delete a location
    @DeleteMapping("/delete/{id}")
    public String deleteLocation(@PathVariable String id) {
        // check if the location exists
        if (!locationRepository.existsById(id)) {
            throw new RuntimeException("Location not found with id: " + id);
        }

        // delete the location
        locationRepository.deleteById(id);

        return "Location with id: " + id + " has been deleted successfully.";
    }

}
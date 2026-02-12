package com.nicolas.tripplanner.controller;

import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.dto.TripResponse;
import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {
    
    private final TripService tripService;
    
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }
    
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Trip>> searchTrips(
            @RequestParam(value = "query", required = false) String query) {
        List<Trip> trips = tripService.searchTrips(query);
        return ResponseEntity.ok(trips);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Trip>> getTripsByCategory(@PathVariable String category) {
        List<Trip> trips = tripService.getTripsByCategory(category);
        return ResponseEntity.ok(trips);
    }
    
    @PostMapping
    public ResponseEntity<Trip> createTrip(@Valid @RequestBody TripRequest request) {
        Trip trip = tripService.createTrip(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(trip);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody TripRequest request) {
        Trip trip = tripService.updateTrip(id, request);
        return ResponseEntity.ok(trip);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
}

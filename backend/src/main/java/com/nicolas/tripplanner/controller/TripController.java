package com.nicolas.tripplanner.controller;

import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.dto.TripResponse;
import com.nicolas.tripplanner.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class TripController {
    
    private final TripService tripService;
    
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }
    
    @GetMapping
    public ResponseEntity<List<TripResponse>> getAllTrips() {
        List<TripResponse> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable Long id) {
        TripResponse trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TripResponse>> searchTrips(
            @RequestParam(value = "query", required = false) String query) {
        List<TripResponse> trips = tripService.searchTrips(query);
        return ResponseEntity.ok(trips);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TripResponse>> getTripsByCategory(@PathVariable String category) {
        List<TripResponse> trips = tripService.getTripsByCategory(category);
        return ResponseEntity.ok(trips);
    }
    
    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody TripRequest request) {
        TripResponse trip = tripService.createTrip(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(trip);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody TripRequest request) {
        TripResponse trip = tripService.updateTrip(id, request);
        return ResponseEntity.ok(trip);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
}

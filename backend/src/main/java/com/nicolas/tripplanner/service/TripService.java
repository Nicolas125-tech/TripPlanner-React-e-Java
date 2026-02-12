package com.nicolas.tripplanner.service;

import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.dto.TripResponse;
import com.nicolas.tripplanner.exception.ResourceNotFoundException;
import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {
    
    private final TripRepository tripRepository;
    
    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }
    
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
    
    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
    }
    
    public List<Trip> searchTrips(String query) {
        if (query == null || query.isBlank()) {
            return getAllTrips();
        }
        return tripRepository.searchTrips(query);
    }
    
    public List<Trip> getTripsByCategory(String category) {
        return tripRepository.findByCategory(category);
    }
    
    public Trip createTrip(TripRequest request) {
        Trip trip = new Trip(
            request.getCity(),
            request.getCountry(),
            request.getPrice(),
            request.getRating(),
            request.getCategory()
        );
        trip.setDescription(request.getDescription());
        trip.setImageUrl(request.getImageUrl());
        
        return tripRepository.save(trip);
    }
    
    public Trip updateTrip(Long id, TripRequest request) {
        Trip trip = getTripById(id);
        
        trip.setCity(request.getCity());
        trip.setCountry(request.getCountry());
        trip.setPrice(request.getPrice());
        trip.setRating(request.getRating());
        trip.setCategory(request.getCategory());
        trip.setDescription(request.getDescription());
        trip.setImageUrl(request.getImageUrl());
        
        return tripRepository.save(trip);
    }
    
    public void deleteTrip(Long id) {
        Trip trip = getTripById(id);
        tripRepository.delete(trip);
    }
}

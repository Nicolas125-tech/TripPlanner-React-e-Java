package com.nicolas.tripplanner.service;

import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.dto.TripResponse;
import com.nicolas.tripplanner.exception.ResourceNotFoundException;
import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {
    
    private final TripRepository tripRepository;
    
    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    private TripResponse mapToResponse(Trip trip) {
        return new TripResponse(
            trip.getId(),
            trip.getCity(),
            trip.getCountry(),
            trip.getPrice(),
            trip.getRating(),
            trip.getCategory(),
            trip.getDescription(),
            trip.getImageUrl()
        );
    }
    
    // ⚡ Bolt Performance Optimization:
    // Added Spring Cache (@Cacheable) for frequent database reads and @CacheEvict for writes.
    // This reduces the number of queries reaching the database and provides O(1) in-memory lookup times for repeated queries.
    @Cacheable("allTrips")
    @Transactional(readOnly = true)
    public List<TripResponse> getAllTrips() {
        return tripRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Cacheable(value = "trip", key = "#id")
    @Transactional(readOnly = true)
    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
        return mapToResponse(trip);
    }
    
    @Cacheable(value = "searchTrips", key = "#query")
    @Transactional(readOnly = true)
    public List<TripResponse> searchTrips(String query) {
        if (query == null || query.isBlank()) {
            return getAllTrips();
        }
        return tripRepository.searchTrips(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Cacheable(value = "tripsByCategory", key = "#category")
    @Transactional(readOnly = true)
    public List<TripResponse> getTripsByCategory(String category) {
        return tripRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @CacheEvict(value = {"allTrips", "searchTrips", "tripsByCategory"}, allEntries = true)
    @Transactional
    public TripResponse createTrip(TripRequest request) {
        Trip trip = new Trip(
            request.getCity(),
            request.getCountry(),
            request.getPrice(),
            request.getRating(),
            request.getCategory()
        );
        trip.setDescription(request.getDescription());
        trip.setImageUrl(request.getImageUrl());
        
        Trip savedTrip = tripRepository.save(trip);
        return mapToResponse(savedTrip);
    }
    
    @CacheEvict(value = {"allTrips", "searchTrips", "tripsByCategory", "trip"}, allEntries = true)
    @Transactional
    public TripResponse updateTrip(Long id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
        
        trip.setCity(request.getCity());
        trip.setCountry(request.getCountry());
        trip.setPrice(request.getPrice());
        trip.setRating(request.getRating());
        trip.setCategory(request.getCategory());
        trip.setDescription(request.getDescription());
        trip.setImageUrl(request.getImageUrl());
        
        Trip updatedTrip = tripRepository.save(trip);
        return mapToResponse(updatedTrip);
    }
    
    @CacheEvict(value = {"allTrips", "searchTrips", "tripsByCategory", "trip"}, allEntries = true)
    @Transactional
    public void deleteTrip(Long id) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
        tripRepository.delete(trip);
    }
}

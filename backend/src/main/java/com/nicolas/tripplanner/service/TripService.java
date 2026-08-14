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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    @Cacheable(value = "allTrips", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()")
    @Transactional(readOnly = true)
    public Page<TripResponse> getAllTrips(Pageable pageable) {
        return tripRepository.findAll(pageable).map(this::mapToResponse);
    }
    
    @Cacheable(value = "trip", key = "#id")
    @Transactional(readOnly = true)
    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
        return mapToResponse(trip);
    }
    
    // ⚡ Bolt Performance Optimization:
    // Normalized the cache key for searchTrips using SpEL: `#query != null ? #query.trim().toLowerCase() : ''`
    // Previously, the key was just `#query`, meaning "Paris", "paris", and " Paris " generated different cache entries,
    // leading to redundant database queries. This normalization significantly improves cache hit rates and memory efficiency.
    @Cacheable(value = "searchTrips", key = "(#query != null ? #query.trim().toLowerCase() : '') + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()")
    @Transactional(readOnly = true)
    public Page<TripResponse> searchTrips(String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return getAllTrips(pageable);
        }
        return tripRepository.searchTrips(query, pageable).map(this::mapToResponse);
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

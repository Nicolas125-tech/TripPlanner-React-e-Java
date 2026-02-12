package com.nicolas.tripplanner.repository;

import com.nicolas.tripplanner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    List<Trip> findByCity(String city);
    
    List<Trip> findByCategory(String category);
    
    @Query("SELECT t FROM Trip t WHERE LOWER(t.city) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.country) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Trip> searchTrips(@Param("query") String query);
}

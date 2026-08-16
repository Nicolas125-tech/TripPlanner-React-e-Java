package com.nicolas.tripplanner.service;

import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import com.nicolas.tripplanner.dto.TripResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class TripServiceBenchmarkTest {

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripService tripService;

    @Test
    void benchmarkGetAllTrips() {
        int tripCount = 100000;
        List<Trip> trips = new ArrayList<>(tripCount);
        for (int i = 0; i < tripCount; i++) {
            Trip trip = new Trip("City" + i, "Country", 100.0, 4.0, "Category");
            trip.setId((long) i);
            trips.add(trip);
        }

        when(tripRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(new PageImpl<>(trips.subList(0, 10)));

        long startTime = System.currentTimeMillis();
        org.springframework.data.domain.Page<TripResponse> responses = tripService.getAllTrips(0, 10);
        long endTime = System.currentTimeMillis();

        System.out.println("Benchmark findAll (100k items) time: " + (endTime - startTime) + " ms");
    }
}

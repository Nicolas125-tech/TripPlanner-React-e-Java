package com.nicolas.tripplanner;

import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class TripPaginationBenchmarkTest {

    @Autowired
    private TripRepository tripRepository;

    @Test
    public void benchmarkPagination() {
        // Prepare data
        List<Trip> trips = new ArrayList<>();
        for (int i = 0; i < 5000; i++) {
            Trip t = new Trip("City " + i, "Country", 100.0, 4.0, "Category");
            t.setDescription("Desc " + i);
            t.setImageUrl("http://example.com/img.jpg");
            trips.add(t);
        }
        tripRepository.saveAll(trips);

        // Warm up
        for (int i = 0; i < 5; i++) {
            tripRepository.findAll();
            tripRepository.findAll(PageRequest.of(0, 10));
        }

        // Measure without pagination
        long start1 = System.currentTimeMillis();
        for (int i = 0; i < 100; i++) {
            tripRepository.findAll();
        }
        long end1 = System.currentTimeMillis();

        // Measure with pagination
        long start2 = System.currentTimeMillis();
        for (int i = 0; i < 100; i++) {
            tripRepository.findAll(PageRequest.of(0, 10));
        }
        long end2 = System.currentTimeMillis();

        System.out.println("========================================================================");
        System.out.println("Benchmark: findAll() without pagination: " + (end1 - start1) + " ms");
        System.out.println("Benchmark: findAll(PageRequest) with pagination: " + (end2 - start2) + " ms");
        System.out.println("========================================================================");
    }
}

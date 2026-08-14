package com.nicolas.tripplanner.repository;

import com.nicolas.tripplanner.model.Trip;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

@DataJpaTest(properties = {
    "spring.jpa.show-sql=false",
    "spring.jpa.properties.hibernate.format_sql=false"
})
class TripRepositoryBenchmarkTest {

    @Autowired
    private TripRepository tripRepository;

    @BeforeEach
    void setUp() {
        List<Trip> trips = new ArrayList<>();
        for (int i = 0; i < 50000; i++) {
            trips.add(new Trip("City" + i, "Country" + (i % 100), 1000.0, 4.5, "Category" + (i % 10)));
        }
        trips.add(new Trip("Paris", "France", 1200.0, 4.8, "City"));
        tripRepository.saveAll(trips);
    }

    @AfterEach
    void tearDown() {
        tripRepository.deleteAll();
    }

    @Test
    void benchmarkSearchTrips() {
        // Warmup
        for (int i = 0; i < 100; i++) {
            tripRepository.searchTrips("City500");
        }

        long start = System.nanoTime();
        for (int i = 0; i < 100; i++) { // Run 100 times to get a stable average
            tripRepository.searchTrips("City" + i);
        }
        long end = System.nanoTime();
        System.out.println("Execution time for 100 searches: " + (end - start) / 1000000.0 + " ms");
    }
}

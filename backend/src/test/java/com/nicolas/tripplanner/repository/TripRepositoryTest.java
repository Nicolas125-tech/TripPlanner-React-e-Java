package com.nicolas.tripplanner.repository;

import com.nicolas.tripplanner.model.Trip;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TripRepositoryTest {

    @Autowired
    private TripRepository tripRepository;

    private Trip trip1;
    private Trip trip2;

    @BeforeEach
    void setUp() {
        trip1 = new Trip("Paris", "France", 1200.0, 4.8, "City");
        trip1.setDescription("Beautiful city");
        tripRepository.save(trip1);

        trip2 = new Trip("Rio de Janeiro", "Brazil", 800.0, 4.7, "Beach");
        trip2.setDescription("Wonderful city");
        tripRepository.save(trip2);
    }

    @AfterEach
    void tearDown() {
        tripRepository.deleteAll();
    }

    @Test
    void findByCategory_shouldReturnTrips_whenCategoryExists() {
        List<Trip> cityTrips = tripRepository.findByCategory("City");

        assertEquals(1, cityTrips.size());
        assertEquals("Paris", cityTrips.get(0).getCity());

        List<Trip> beachTrips = tripRepository.findByCategory("Beach");

        assertEquals(1, beachTrips.size());
        assertEquals("Rio de Janeiro", beachTrips.get(0).getCity());
    }

    @Test
    void findByCity_shouldReturnTrips_whenCityExists() {
        List<Trip> parisTrips = tripRepository.findByCity("Paris");

        assertEquals(1, parisTrips.size());
        assertEquals("Paris", parisTrips.get(0).getCity());

        List<Trip> nonExistentTrips = tripRepository.findByCity("UnknownCity");
        assertTrue(nonExistentTrips.isEmpty());
    }

    @Test
    void searchTrips_shouldReturnTrips_matchingCityOrCountry() {
        List<Trip> result = tripRepository.searchTrips("rio");

        assertEquals(1, result.size());
        assertEquals("Rio de Janeiro", result.get(0).getCity());

        List<Trip> result2 = tripRepository.searchTrips("fran");

        assertEquals(1, result2.size());
        assertEquals("Paris", result2.get(0).getCity());
    }
}

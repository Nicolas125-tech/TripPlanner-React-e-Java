package com.nicolas.tripplanner.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TripTest {

    @Test
    void testDefaultConstructor() {
        Trip trip = new Trip();
        assertNull(trip.getId());
        assertNull(trip.getCity());
        assertNull(trip.getCountry());
        assertNull(trip.getPrice());
        assertNull(trip.getRating());
        assertNull(trip.getCategory());
        assertNull(trip.getDescription());
        assertNull(trip.getImageUrl());
    }

    @Test
    void testParameterizedConstructor() {
        Trip trip = new Trip("Paris", "France", 1200.0, 4.8, "City");

        assertNull(trip.getId());
        assertEquals("Paris", trip.getCity());
        assertEquals("France", trip.getCountry());
        assertEquals(1200.0, trip.getPrice());
        assertEquals(4.8, trip.getRating());
        assertEquals("City", trip.getCategory());
        assertNull(trip.getDescription());
        assertNull(trip.getImageUrl());
    }

    @Test
    void testSettersAndGetters() {
        Trip trip = new Trip();

        trip.setId(1L);
        assertEquals(1L, trip.getId());

        trip.setCity("Tokyo");
        assertEquals("Tokyo", trip.getCity());

        trip.setCountry("Japan");
        assertEquals("Japan", trip.getCountry());

        trip.setPrice(2500.0);
        assertEquals(2500.0, trip.getPrice());

        trip.setRating(4.9);
        assertEquals(4.9, trip.getRating());

        trip.setCategory("Adventure");
        assertEquals("Adventure", trip.getCategory());

        trip.setDescription("A wonderful trip to Tokyo.");
        assertEquals("A wonderful trip to Tokyo.", trip.getDescription());

        trip.setImageUrl("http://example.com/tokyo.jpg");
        assertEquals("http://example.com/tokyo.jpg", trip.getImageUrl());
    }
}

package com.nicolas.tripplanner.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class TripResponseTest {

    @Test
    void testConstructorAndGetters() {
        Long id = 1L;
        String city = "Paris";
        String country = "France";
        Double price = 1500.0;
        Double rating = 4.8;
        String category = "Cultural";
        String description = "A beautiful trip to Paris.";
        String imageUrl = "http://example.com/paris.jpg";

        TripResponse tripResponse = TripResponse.builder()
            .id(id)
            .city(city)
            .country(country)
            .price(price)
            .rating(rating)
            .category(category)
            .description(description)
            .imageUrl(imageUrl)
            .build();

        assertEquals(id, tripResponse.getId());
        assertEquals(city, tripResponse.getCity());
        assertEquals(country, tripResponse.getCountry());
        assertEquals(price, tripResponse.getPrice());
        assertEquals(rating, tripResponse.getRating());
        assertEquals(category, tripResponse.getCategory());
        assertEquals(description, tripResponse.getDescription());
        assertEquals(imageUrl, tripResponse.getImageUrl());
    }

    @Test
    void testEmptyBuilder() {
        TripResponse tripResponse = TripResponse.builder().build();

        assertNull(tripResponse.getId());
        assertNull(tripResponse.getCity());
        assertNull(tripResponse.getCountry());
        assertNull(tripResponse.getPrice());
        assertNull(tripResponse.getRating());
        assertNull(tripResponse.getCategory());
        assertNull(tripResponse.getDescription());
        assertNull(tripResponse.getImageUrl());
    }

    @Test
    void testPartialBuilder() {
        Long id = 2L;
        String city = "Tokyo";
        Double price = 2000.0;

        TripResponse tripResponse = TripResponse.builder()
            .id(id)
            .city(city)
            .price(price)
            .build();

        assertEquals(id, tripResponse.getId());
        assertEquals(city, tripResponse.getCity());
        assertNull(tripResponse.getCountry());
        assertEquals(price, tripResponse.getPrice());
        assertNull(tripResponse.getRating());
        assertNull(tripResponse.getCategory());
        assertNull(tripResponse.getDescription());
        assertNull(tripResponse.getImageUrl());
    }
}

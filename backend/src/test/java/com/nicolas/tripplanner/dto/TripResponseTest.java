package com.nicolas.tripplanner.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

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
}

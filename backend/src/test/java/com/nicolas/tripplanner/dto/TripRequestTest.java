package com.nicolas.tripplanner.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class TripRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testConstructorAndGettersAndSetters() {
        String city = "Rio de Janeiro";
        String country = "Brazil";
        Double price = 500.0;
        Double rating = 4.5;
        String category = "Beach";
        String description = "Beautiful beach city";
        String imageUrl = "http://example.com/rio.jpg";

        TripRequest tripRequest = new TripRequest(city, country, price, rating, category);

        // Assert constructor properties
        assertEquals(city, tripRequest.getCity());
        assertEquals(country, tripRequest.getCountry());
        assertEquals(price, tripRequest.getPrice());
        assertEquals(rating, tripRequest.getRating());
        assertEquals(category, tripRequest.getCategory());

        // Test remaining setters and getters
        tripRequest.setDescription(description);
        tripRequest.setImageUrl(imageUrl);

        assertEquals(description, tripRequest.getDescription());
        assertEquals(imageUrl, tripRequest.getImageUrl());

        // Test overwriting via setters
        String newCity = "São Paulo";
        tripRequest.setCity(newCity);
        assertEquals(newCity, tripRequest.getCity());
    }

    @Test
    void testValidTripRequest() {
        TripRequest request = new TripRequest("Paris", "France", 1000.0, 4.8, "Culture");
        request.setDescription("A nice trip");
        request.setImageUrl("http://example.com/image.jpg");

        Set<ConstraintViolation<TripRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Valid request should not have any violations");
    }

    @Test
    void testCityIsNotBlank() {
        TripRequest request = new TripRequest("", "France", 1000.0, 4.8, "Culture");

        Set<ConstraintViolation<TripRequest>> violations = validator.validateProperty(request, "city");
        assertEquals(1, violations.size());
        assertEquals("Cidade é obrigatória", violations.iterator().next().getMessage());

        request.setCity(null);
        violations = validator.validateProperty(request, "city");
        assertEquals(1, violations.size());
        assertEquals("Cidade é obrigatória", violations.iterator().next().getMessage());
    }

    @Test
    void testCountryIsNotBlank() {
        TripRequest request = new TripRequest("Paris", "", 1000.0, 4.8, "Culture");

        Set<ConstraintViolation<TripRequest>> violations = validator.validateProperty(request, "country");
        assertEquals(1, violations.size());
        assertEquals("País é obrigatório", violations.iterator().next().getMessage());

        request.setCountry(null);
        violations = validator.validateProperty(request, "country");
        assertEquals(1, violations.size());
        assertEquals("País é obrigatório", violations.iterator().next().getMessage());
    }

    @Test
    void testPriceIsPositive() {
        TripRequest request = new TripRequest("Paris", "France", -10.0, 4.8, "Culture");

        Set<ConstraintViolation<TripRequest>> violations = validator.validateProperty(request, "price");
        assertEquals(1, violations.size());
        assertEquals("Preço deve ser positivo", violations.iterator().next().getMessage());

        request.setPrice(0.0);
        violations = validator.validateProperty(request, "price");
        assertEquals(1, violations.size());
        assertEquals("Preço deve ser positivo", violations.iterator().next().getMessage());
    }

    @Test
    void testRatingIsPositive() {
        TripRequest request = new TripRequest("Paris", "France", 1000.0, -1.0, "Culture");

        Set<ConstraintViolation<TripRequest>> violations = validator.validateProperty(request, "rating");
        assertEquals(1, violations.size());
        assertEquals("Rating deve ser positivo", violations.iterator().next().getMessage());

        request.setRating(0.0);
        violations = validator.validateProperty(request, "rating");
        assertEquals(1, violations.size());
        assertEquals("Rating deve ser positivo", violations.iterator().next().getMessage());
    }

    @Test
    void testImageUrlIsValidUrlAndSize() {
        TripRequest request = new TripRequest("Paris", "France", 1000.0, 4.8, "Culture");

        // Invalid URL
        request.setImageUrl("not-a-url");
        Set<ConstraintViolation<TripRequest>> violations = validator.validateProperty(request, "imageUrl");
        assertEquals(1, violations.size());
        assertEquals("URL da imagem inválida", violations.iterator().next().getMessage());

        // Size constraint
        StringBuilder longUrl = new StringBuilder("http://example.com/");
        for (int i = 0; i < 2050; i++) {
            longUrl.append("a");
        }
        request.setImageUrl(longUrl.toString());
        violations = validator.validateProperty(request, "imageUrl");
        assertEquals(1, violations.size());
        assertEquals("URL da imagem deve ter no máximo 2048 caracteres", violations.iterator().next().getMessage());
    }
}

package com.nicolas.tripplanner.config;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class CorsValidationConfigTest {

    @Test
    void testValidOrigins() {
        CorsValidationConfig config = new CorsValidationConfig();
        assertDoesNotThrow(() -> config.setAllowedOrigins("http://localhost:3000"));
        assertDoesNotThrow(() -> config.setAllowedOrigins("https://example.com"));
        assertDoesNotThrow(() -> config.setAllowedOrigins(null));
    }

    @Test
    void testInvalidOrigins() {
        CorsValidationConfig config = new CorsValidationConfig();
        assertThrows(IllegalArgumentException.class, () -> config.setAllowedOrigins("*"));
        assertThrows(IllegalArgumentException.class, () -> config.setAllowedOrigins("http://localhost:3000,*"));
    }
}

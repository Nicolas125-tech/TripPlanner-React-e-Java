package com.nicolas.tripplanner.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class SecurityConfigCorsValidationTest {

    @Test
    public void testValidateCors_throwsExceptionForWildcard() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "*");

        assertThrows(IllegalArgumentException.class, () -> {
            config.validateCorsConfiguration();
        });
    }

    @Test
    public void testValidateCors_succeedsForValidOrigin() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "http://localhost:3000");

        assertDoesNotThrow(() -> {
            config.validateCorsConfiguration();
        });
    }
}

package com.nicolas.tripplanner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CorsValidationConfig {

    @Value("${app.cors.allowed-origins}")
    public void setAllowedOrigins(String allowedOrigins) {
        if (allowedOrigins != null && allowedOrigins.contains("*")) {
            throw new IllegalArgumentException("Permissive CORS policy is not allowed. Wildcard '*' origin is forbidden.");
        }
    }
}

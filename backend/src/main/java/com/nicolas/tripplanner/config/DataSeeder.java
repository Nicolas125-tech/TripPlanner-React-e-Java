package com.nicolas.tripplanner.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;

@Configuration
public class DataSeeder {
    
    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    public CommandLineRunner seedDatabase(TripRepository tripRepository, ObjectMapper objectMapper) {
        return args -> {
            if (tripRepository.count() == 0) {
                try (InputStream inputStream = DataSeeder.class.getResourceAsStream("/data/trips.json")) {
                    List<Trip> trips = objectMapper.readValue(inputStream, new TypeReference<List<Trip>>(){});
                    tripRepository.saveAll(trips);
                    logger.info("Successfully seeded the database with {} trips from external JSON configuration.", trips.size());
                } catch (Exception e) {
                    logger.error("Unable to seed database: {}", e.getMessage(), e);
                }
            } else {
                logger.info("Database already seeded, skipping DataSeeder execution.");
            }
        };
    }
}

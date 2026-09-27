package com.nicolas.tripplanner.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.CommandLineRunner;

import java.io.InputStream;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataSeederTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private DataSeeder dataSeeder;

    @Test
    void seedDatabase_shouldSeedData_whenDatabaseIsEmpty() throws Exception {
        // Arrange
        when(tripRepository.count()).thenReturn(0L);
        when(objectMapper.readValue(any(InputStream.class), any(TypeReference.class)))
                .thenReturn(Collections.<Trip>emptyList());

        CommandLineRunner runner = dataSeeder.seedDatabase(tripRepository, objectMapper);

        // Act
        runner.run();

        // Assert
        verify(tripRepository, times(1)).count();
        verify(tripRepository, times(1)).saveAll(any());
    }

    @Test
    void seedDatabase_shouldNotSeedData_whenDatabaseIsNotEmpty() throws Exception {
        // Arrange
        when(tripRepository.count()).thenReturn(5L);
        CommandLineRunner runner = dataSeeder.seedDatabase(tripRepository, objectMapper);

        // Act
        runner.run();

        // Assert
        verify(tripRepository, times(1)).count();
        verify(tripRepository, never()).saveAll(any());
    }
}

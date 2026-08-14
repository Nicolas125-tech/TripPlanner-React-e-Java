package com.nicolas.tripplanner.config;

import com.nicolas.tripplanner.repository.TripRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.CommandLineRunner;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataSeederTest {

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private DataSeeder dataSeeder;

    @Test
    void seedDatabase_shouldSeedData_whenDatabaseIsEmpty() throws Exception {
        // Arrange
        when(tripRepository.count()).thenReturn(0L);
        CommandLineRunner runner = dataSeeder.seedDatabase(tripRepository);

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
        CommandLineRunner runner = dataSeeder.seedDatabase(tripRepository);

        // Act
        runner.run();

        // Assert
        verify(tripRepository, times(1)).count();
        verify(tripRepository, never()).saveAll(any());
    }
}

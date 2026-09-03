package com.nicolas.tripplanner.service;

import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.dto.TripResponse;
import com.nicolas.tripplanner.exception.ResourceNotFoundException;
import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripService tripService;

    private Trip trip1;
    private Trip trip2;

    @BeforeEach
    void setUp() {
        trip1 = new Trip("Paris", "France", 1200.0, 4.8, "City");
        trip1.setId(1L);
        trip1.setDescription("Beautiful city");
        trip1.setImageUrl("paris.jpg");

        trip2 = new Trip("Tokyo", "Japan", 1500.0, 4.9, "City");
        trip2.setId(2L);
    }

    @Test
    void getAllTrips_shouldReturnAllTrips() {
        when(tripRepository.findAll()).thenReturn(Arrays.asList(trip1, trip2));

        List<TripResponse> trips = tripService.getAllTrips();

        assertEquals(2, trips.size());
        assertEquals("Paris", trips.get(0).getCity());
        assertEquals("Tokyo", trips.get(1).getCity());
        verify(tripRepository, times(1)).findAll();
    }

    @Test
    void getTripById_shouldReturnTrip_whenTripExists() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(trip1));

        TripResponse result = tripService.getTripById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Paris", result.getCity());
        verify(tripRepository, times(1)).findById(1L);
    }

    @Test
    void getTripById_shouldThrowException_whenTripDoesNotExist() {
        when(tripRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tripService.getTripById(99L));
        verify(tripRepository, times(1)).findById(99L);
    }

    @Test
    void searchTrips_shouldReturnAll_whenQueryIsBlank() {
        when(tripRepository.findAll()).thenReturn(Arrays.asList(trip1, trip2));

        List<TripResponse> trips = tripService.searchTrips("  ");

        assertEquals(2, trips.size());
        verify(tripRepository, times(1)).findAll();
        verify(tripRepository, never()).searchTrips(anyString());
    }

    @Test
    void searchTrips_shouldReturnMatchingTrips_whenQueryIsNotBlank() {
        when(tripRepository.searchTrips("Paris")).thenReturn(Collections.singletonList(trip1));

        List<TripResponse> trips = tripService.searchTrips("Paris");

        assertEquals(1, trips.size());
        assertEquals("Paris", trips.get(0).getCity());
        verify(tripRepository, times(1)).searchTrips("Paris");
    }

    @Test
    void getTripsByCategory_shouldReturnMatchingTrips() {
        when(tripRepository.findByCategory("City")).thenReturn(Arrays.asList(trip1, trip2));

        List<TripResponse> trips = tripService.getTripsByCategory("City");

        assertEquals(2, trips.size());
        verify(tripRepository, times(1)).findByCategory("City");
    }

    @Test
    void createTrip_shouldSaveAndReturnTrip() {
        TripRequest request = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
        request.setDescription("Historic city");
        request.setImageUrl("rome.jpg");

        Trip savedTrip = new Trip("Rome", "Italy", 1000.0, 4.7, "City");
        savedTrip.setId(3L);
        savedTrip.setDescription("Historic city");
        savedTrip.setImageUrl("rome.jpg");

        when(tripRepository.save(any(Trip.class))).thenReturn(savedTrip);

        TripResponse result = tripService.createTrip(request);

        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("Rome", result.getCity());
        assertEquals("Historic city", result.getDescription());
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    void createTrip_shouldThrowException_whenRepositorySaveFails() {
        TripRequest request = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
        request.setDescription("Historic city");
        request.setImageUrl("rome.jpg");

        when(tripRepository.save(any(Trip.class))).thenThrow(new RuntimeException("Database error"));

        assertThrows(RuntimeException.class, () -> tripService.createTrip(request));
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    void updateTrip_shouldUpdateAndReturnTrip_whenTripExists() {
        TripRequest request = new TripRequest("Paris Updated", "France Updated", 1300.0, 4.9, "City Plus");

        when(tripRepository.findById(1L)).thenReturn(Optional.of(trip1));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TripResponse result = tripService.updateTrip(1L, request);

        assertNotNull(result);
        assertEquals("Paris Updated", result.getCity());
        assertEquals("France Updated", result.getCountry());
        assertEquals(1300.0, result.getPrice());
        verify(tripRepository, times(1)).findById(1L);
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    void updateTrip_shouldThrowException_whenTripDoesNotExist() {
        TripRequest request = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
        when(tripRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tripService.updateTrip(99L, request));
        verify(tripRepository, times(1)).findById(99L);
        verify(tripRepository, never()).save(any(Trip.class));
    }

    @Test
    void deleteTrip_shouldDeleteTrip_whenTripExists() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(trip1));

        tripService.deleteTrip(1L);

        verify(tripRepository, times(1)).findById(1L);
        verify(tripRepository, times(1)).delete(trip1);
    }

    @Test
    void deleteTrip_shouldThrowException_whenTripDoesNotExist() {
        when(tripRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tripService.deleteTrip(99L));
        verify(tripRepository, times(1)).findById(99L);
        verify(tripRepository, never()).delete(any(Trip.class));
    }
}

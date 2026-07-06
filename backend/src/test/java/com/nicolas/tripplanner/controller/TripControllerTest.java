package com.nicolas.tripplanner.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.exception.ResourceNotFoundException;
import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TripController.class)
class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TripService tripService;

    @Autowired
    private ObjectMapper objectMapper;

    private Trip trip1;
    private Trip trip2;
    private TripRequest tripRequest;

    @BeforeEach
    void setUp() {
        trip1 = new Trip("Paris", "France", 1200.0, 4.8, "City");
        trip1.setId(1L);

        trip2 = new Trip("Tokyo", "Japan", 1500.0, 4.9, "City");
        trip2.setId(2L);

        tripRequest = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
    }

    @Test
    void getAllTrips_shouldReturnTrips() throws Exception {
        when(tripService.getAllTrips()).thenReturn(Arrays.asList(trip1, trip2));

        mockMvc.perform(get("/api/trips"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].city").value("Paris"))
                .andExpect(jsonPath("$[1].city").value("Tokyo"));
    }

    @Test
    void getTripById_shouldReturnTrip() throws Exception {
        when(tripService.getTripById(1L)).thenReturn(trip1);

        mockMvc.perform(get("/api/trips/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Paris"))
                .andExpect(jsonPath("$.country").value("France"));
    }

    @Test
    void getTripById_shouldReturn404_whenNotFound() throws Exception {
        when(tripService.getTripById(99L)).thenThrow(new ResourceNotFoundException("Not found"));

        mockMvc.perform(get("/api/trips/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void searchTrips_shouldReturnTrips() throws Exception {
        when(tripService.searchTrips("Paris")).thenReturn(Collections.singletonList(trip1));

        mockMvc.perform(get("/api/trips/search").param("query", "Paris"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].city").value("Paris"));
    }

    @Test
    void getTripsByCategory_shouldReturnTrips() throws Exception {
        when(tripService.getTripsByCategory("City")).thenReturn(Arrays.asList(trip1, trip2));

        mockMvc.perform(get("/api/trips/category/City"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }

    @Test
    void createTrip_shouldReturnCreatedTrip() throws Exception {
        Trip createdTrip = new Trip("Rome", "Italy", 1000.0, 4.7, "City");
        createdTrip.setId(3L);

        when(tripService.createTrip(any(TripRequest.class))).thenReturn(createdTrip);

        mockMvc.perform(post("/api/trips")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tripRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.city").value("Rome"));
    }

    @Test
    void updateTrip_shouldReturnUpdatedTrip() throws Exception {
        Trip updatedTrip = new Trip("Rome Updated", "Italy", 1100.0, 4.8, "City");
        updatedTrip.setId(1L);

        when(tripService.updateTrip(eq(1L), any(TripRequest.class))).thenReturn(updatedTrip);

        mockMvc.perform(put("/api/trips/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tripRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Rome Updated"));
    }

    @Test
    void deleteTrip_shouldReturnNoContent() throws Exception {
        doNothing().when(tripService).deleteTrip(1L);

        mockMvc.perform(delete("/api/trips/1"))
                .andExpect(status().isNoContent());

        verify(tripService, times(1)).deleteTrip(1L);
    }
}

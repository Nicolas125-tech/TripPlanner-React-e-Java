package com.nicolas.tripplanner.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.dto.TripResponse;
import com.nicolas.tripplanner.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@org.springframework.boot.test.context.SpringBootTest
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc


class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TripService tripService;

    @Autowired
    private ObjectMapper objectMapper;

    private TripResponse trip1;
    private TripResponse trip2;

    @BeforeEach
    void setUp() {
        trip1 = new TripResponse(1L, "Paris", "France", 1200.0, 4.8, "City", "Beautiful city", "paris.jpg");
        trip2 = new TripResponse(2L, "Tokyo", "Japan", 1500.0, 4.9, "City", "Amazing city", "tokyo.jpg");
    }

    @Test
    @WithMockUser
    void getAllTrips_shouldReturnListOfTrips() throws Exception {
        when(tripService.getAllTrips(any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(trip1, trip2), PageRequest.of(0, 10), 2));

        mockMvc.perform(get("/api/trips")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].city").value("Paris"))
                .andExpect(jsonPath("$.content[1].city").value("Tokyo"));

        verify(tripService, times(1)).getAllTrips(any(Pageable.class));
    }

    @Test
    @WithMockUser
    void getTripById_shouldReturnTrip() throws Exception {
        when(tripService.getTripById(1L)).thenReturn(trip1);

        mockMvc.perform(get("/api/trips/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Paris"));

        verify(tripService, times(1)).getTripById(1L);
    }

    @Test
    @WithMockUser
    void searchTrips_shouldReturnListOfTrips_whenNoQuery() throws Exception {
        when(tripService.searchTrips(isNull(), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(trip1, trip2), PageRequest.of(0, 10), 2));

        mockMvc.perform(get("/api/trips/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2));

        verify(tripService, times(1)).searchTrips(isNull(), any(Pageable.class));
    }

    @Test
    @WithMockUser
    void searchTrips_shouldReturnListOfTrips_withQuery() throws Exception {
        when(tripService.searchTrips(eq("Paris"), any(Pageable.class))).thenReturn(new PageImpl<>(Collections.singletonList(trip1), PageRequest.of(0, 10), 1));

        mockMvc.perform(get("/api/trips/search")
                .param("query", "Paris")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].city").value("Paris"));

        verify(tripService, times(1)).searchTrips(eq("Paris"), any(Pageable.class));
    }

    @Test
    @WithMockUser
    void getTripsByCategory_shouldReturnListOfTrips() throws Exception {
        when(tripService.getTripsByCategory("City")).thenReturn(Arrays.asList(trip1, trip2));

        mockMvc.perform(get("/api/trips/category/City")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(tripService, times(1)).getTripsByCategory("City");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTrip_shouldReturnCreatedTrip() throws Exception {
        TripRequest request = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
        TripResponse response = new TripResponse(3L, "Rome", "Italy", 1000.0, 4.7, "City", null, null);

        when(tripService.createTrip(any(TripRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/trips")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.city").value("Rome"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateTrip_shouldReturnUpdatedTrip() throws Exception {
        TripRequest request = new TripRequest("Paris Updated", "France Updated", 1300.0, 4.9, "City");
        TripResponse response = new TripResponse(1L, "Paris Updated", "France Updated", 1300.0, 4.9, "City", null, null);

        when(tripService.updateTrip(eq(1L), any(TripRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/trips/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Paris Updated"));
    }

    @Test
    @WithMockUser
    void getTripById_shouldReturn404_whenNotFound() throws Exception {
        when(tripService.getTripById(99L)).thenThrow(new com.nicolas.tripplanner.exception.ResourceNotFoundException("Trip not found"));

        mockMvc.perform(get("/api/trips/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTrip_shouldReturn400_whenImageUrlIsInvalid() throws Exception {
        TripRequest request = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
        request.setImageUrl("invalid-url");

        mockMvc.perform(post("/api/trips")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteTrip_shouldReturnNoContent() throws Exception {
        doNothing().when(tripService).deleteTrip(1L);

        mockMvc.perform(delete("/api/trips/1")
                .with(csrf()))
                .andExpect(status().isNoContent());

        verify(tripService, times(1)).deleteTrip(1L);
    }
}

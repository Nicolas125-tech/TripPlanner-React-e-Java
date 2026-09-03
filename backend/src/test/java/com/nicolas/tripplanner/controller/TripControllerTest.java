package com.nicolas.tripplanner.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.dto.TripResponse;
import com.nicolas.tripplanner.exception.ResourceNotFoundException;
import com.nicolas.tripplanner.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import com.nicolas.tripplanner.config.SecurityConfig;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = TripController.class, properties = {"ADMIN_USERNAME=admin", "ADMIN_PASSWORD=admin"})
@Import(SecurityConfig.class)
class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TripService tripService;

    private TripResponse tripResponse1;
    private TripResponse tripResponse2;

    @BeforeEach
    void setUp() {
        tripResponse1 = new TripResponse(1L, "Paris", "France", 1200.0, 4.8, "City", "Beautiful city", "paris.jpg");
        tripResponse2 = new TripResponse(2L, "Tokyo", "Japan", 1500.0, 4.9, "City", "Bustling city", "tokyo.jpg");
    }

    @Test
    void getAllTrips_shouldReturnListOfTrips() throws Exception {
        when(tripService.getAllTrips()).thenReturn(Arrays.asList(tripResponse1, tripResponse2));

        mockMvc.perform(get("/api/trips"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].city").value("Paris"))
                .andExpect(jsonPath("$[1].city").value("Tokyo"))
                .andExpect(jsonPath("$.length()").value(2));

        verify(tripService, times(1)).getAllTrips();
    }

    @Test
    void getTripById_shouldReturnTrip() throws Exception {
        when(tripService.getTripById(1L)).thenReturn(tripResponse1);

        mockMvc.perform(get("/api/trips/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.city").value("Paris"));

        verify(tripService, times(1)).getTripById(1L);
    }

    @Test
    void getTripById_shouldReturn404_whenNotFound() throws Exception {
        when(tripService.getTripById(99L)).thenThrow(new ResourceNotFoundException("Trip not found"));

        mockMvc.perform(get("/api/trips/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Trip not found"));

        verify(tripService, times(1)).getTripById(99L);
    }

    @Test
    void searchTrips_shouldReturnTrips_whenQueryIsMissing() throws Exception {
        when(tripService.searchTrips(null)).thenReturn(Arrays.asList(tripResponse1, tripResponse2));

        mockMvc.perform(get("/api/trips/search"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].city").value("Paris"))
                .andExpect(jsonPath("$[1].city").value("Tokyo"))
                .andExpect(jsonPath("$.length()").value(2));

        verify(tripService, times(1)).searchTrips(null);
    }

    @Test
    void searchTrips_shouldReturnMatchingTrips() throws Exception {
        when(tripService.searchTrips("Paris")).thenReturn(Collections.singletonList(tripResponse1));

        mockMvc.perform(get("/api/trips/search").param("query", "Paris"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].city").value("Paris"))
                .andExpect(jsonPath("$.length()").value(1));

        verify(tripService, times(1)).searchTrips("Paris");
    }

    @Test
    void searchTrips_shouldReturnTrips_whenQueryIsEmptyString() throws Exception {
        when(tripService.searchTrips("")).thenReturn(Arrays.asList(tripResponse1, tripResponse2));

        mockMvc.perform(get("/api/trips/search").param("query", ""))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].city").value("Paris"))
                .andExpect(jsonPath("$[1].city").value("Tokyo"))
                .andExpect(jsonPath("$.length()").value(2));

        verify(tripService, times(1)).searchTrips("");
    }

    @Test
    void searchTrips_shouldReturnTrips_whenQueryIsWhitespace() throws Exception {
        when(tripService.searchTrips("   ")).thenReturn(Arrays.asList(tripResponse1, tripResponse2));

        mockMvc.perform(get("/api/trips/search").param("query", "   "))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].city").value("Paris"))
                .andExpect(jsonPath("$[1].city").value("Tokyo"))
                .andExpect(jsonPath("$.length()").value(2));

        verify(tripService, times(1)).searchTrips("   ");
    }

    @Test
    void searchTrips_shouldReturnEmptyList_whenNoMatchesFound() throws Exception {
        when(tripService.searchTrips("UnknownPlace")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/trips/search").param("query", "UnknownPlace"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));

        verify(tripService, times(1)).searchTrips("UnknownPlace");
    }

    @Test
    void getTripsByCategory_shouldReturnMatchingTrips() throws Exception {
        when(tripService.getTripsByCategory("City")).thenReturn(Arrays.asList(tripResponse1, tripResponse2));

        mockMvc.perform(get("/api/trips/category/City"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].city").value("Paris"))
                .andExpect(jsonPath("$.length()").value(2));

        verify(tripService, times(1)).getTripsByCategory("City");
    }


    @Test
    @WithMockUser(roles = "ADMIN")
    void createTrip_shouldReturn400_whenImageUrlIsInvalid() throws Exception {
        TripRequest request = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
        request.setImageUrl("not-a-valid-url");

        mockMvc.perform(post("/api/trips").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTrip_shouldReturnCreatedTrip() throws Exception {
        TripRequest request = new TripRequest("Rome", "Italy", 1000.0, 4.7, "City");
        TripResponse response = new TripResponse(3L, "Rome", "Italy", 1000.0, 4.7, "City", null, null);

        when(tripService.createTrip(any(TripRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/trips").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.city").value("Rome"));

        verify(tripService, times(1)).createTrip(any(TripRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateTrip_shouldReturnUpdatedTrip() throws Exception {
        TripRequest request = new TripRequest("Paris Updated", "France Updated", 1300.0, 4.9, "City Plus");
        TripResponse response = new TripResponse(1L, "Paris Updated", "France Updated", 1300.0, 4.9, "City Plus", null, null);

        when(tripService.updateTrip(eq(1L), any(TripRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/trips/1").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Paris Updated"));

        verify(tripService, times(1)).updateTrip(eq(1L), any(TripRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteTrip_shouldReturnNoContent() throws Exception {
        doNothing().when(tripService).deleteTrip(1L);

        mockMvc.perform(delete("/api/trips/1").with(csrf()))
                .andExpect(status().isNoContent());

        verify(tripService, times(1)).deleteTrip(1L);
    }
}

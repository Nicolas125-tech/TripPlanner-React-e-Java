package com.nicolas.tripplanner.controller;

import com.nicolas.tripplanner.config.SecurityConfig;
import com.nicolas.tripplanner.dto.TripRequest;
import com.nicolas.tripplanner.service.TripService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = TripController.class, properties = {"ADMIN_USERNAME=admin", "ADMIN_PASSWORD=admin"})
@Import(SecurityConfig.class)
class TripControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TripService tripService;

    @Test
    void createTrip_withoutAuthentication_shouldReturnUnauthorized() throws Exception {
        String requestBody = "{\"city\":\"Rome\",\"country\":\"Italy\",\"price\":1000.0,\"rating\":4.7,\"category\":\"City\",\"description\":\"Test\"}";

        mockMvc.perform(post("/api/trips").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateTrip_withoutAuthentication_shouldReturnUnauthorized() throws Exception {
        String requestBody = "{\"city\":\"Rome Updated\",\"country\":\"Italy\",\"price\":1000.0,\"rating\":4.7,\"category\":\"City\",\"description\":\"Test\"}";

        mockMvc.perform(put("/api/trips/1").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteTrip_withoutAuthentication_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/trips/1").with(csrf()))
                .andExpect(status().isUnauthorized());
    }
}

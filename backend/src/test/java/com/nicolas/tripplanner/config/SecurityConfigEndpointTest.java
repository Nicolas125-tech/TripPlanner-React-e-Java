package com.nicolas.tripplanner.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "ADMIN_USERNAME=testadmin",
    "ADMIN_PASSWORD=testpass",
    "app.cors.allowed-origins=http://localhost:3000"
})
class SecurityConfigEndpointTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getTrips_shouldAllowUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/trips"))
                .andExpect(status().isOk());
    }

    @Test
    void createTrip_shouldRejectUnauthenticatedAccess() throws Exception {
        mockMvc.perform(post("/api/trips").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void createTrip_shouldRejectNonAdminUsers() throws Exception {
        mockMvc.perform(post("/api/trips").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTrip_shouldAllowAdminUsers_butMayFailValidation() throws Exception {
        // Will likely return 400 Bad Request because the body {} is invalid
        mockMvc.perform(post("/api/trips").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateTrip_shouldRejectUnauthenticatedAccess() throws Exception {
        mockMvc.perform(put("/api/trips/1").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void updateTrip_shouldRejectNonAdminUsers() throws Exception {
        mockMvc.perform(put("/api/trips/1").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteTrip_shouldRejectUnauthenticatedAccess() throws Exception {
        mockMvc.perform(delete("/api/trips/1").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void deleteTrip_shouldRejectNonAdminUsers() throws Exception {
        mockMvc.perform(delete("/api/trips/1").with(csrf()))
                .andExpect(status().isForbidden());
    }
}

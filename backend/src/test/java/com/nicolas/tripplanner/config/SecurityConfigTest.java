package com.nicolas.tripplanner.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "ADMIN_USERNAME=testadmin",
    "ADMIN_PASSWORD=testpass",
    "app.cors.allowed-origins=http://localhost:3000"
})
class SecurityConfigTest {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void userDetailsService_shouldContainAdminUser() {
        UserDetails user = userDetailsService.loadUserByUsername("testadmin");

        assertNotNull(user);
        assertEquals("testadmin", user.getUsername());
        assertTrue(user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(passwordEncoder.matches("testpass", user.getPassword()));
    }

    @Test
    void passwordEncoder_shouldBeBCrypt() {
        String rawPassword = "password";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));
        assertNotEquals(rawPassword, encodedPassword);
    }
}

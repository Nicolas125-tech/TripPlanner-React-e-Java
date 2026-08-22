package com.nicolas.tripplanner.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

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

    @Test
    void passwordEncoderBean_directInstantiation_shouldReturnBCryptPasswordEncoder() {
        SecurityConfig config = new SecurityConfig();
        PasswordEncoder encoder = config.passwordEncoder();

        assertNotNull(encoder);
        assertInstanceOf(BCryptPasswordEncoder.class, encoder);

        String rawPassword = "directPassword123";
        String encoded = encoder.encode(rawPassword);
        assertTrue(encoder.matches(rawPassword, encoded));
    }

    @Test
    void userDetailsServiceBean_directInstantiation_shouldReturnInMemoryUserDetailsManagerWithAdmin() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "adminUsername", "directAdmin");
        ReflectionTestUtils.setField(config, "adminPassword", "directPass");

        UserDetailsService manager = config.userDetailsService();

        assertNotNull(manager);
        assertInstanceOf(InMemoryUserDetailsManager.class, manager);

        UserDetails user = manager.loadUserByUsername("directAdmin");
        assertNotNull(user);
        assertEquals("directAdmin", user.getUsername());
        assertTrue(user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));

        PasswordEncoder encoder = config.passwordEncoder();
        assertTrue(encoder.matches("directPass", user.getPassword()));
    }
}

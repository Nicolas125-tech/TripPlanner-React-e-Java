package com.nicolas.tripplanner.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> {
                CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
                repository.setCookieCustomizer(customizer -> customizer.secure(true));
                csrf.csrfTokenRepository(repository);
            })
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(HttpMethod.GET, "/api/trips", "/api/trips/*", "/api/trips/search", "/api/trips/category/*").permitAll() // Explicitly allow intended read operations
                .requestMatchers(HttpMethod.POST, "/api/trips").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/trips/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/trips/*").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()); // Use basic authentication

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(
            @Value("${ADMIN_USERNAME}") String adminUsername,
            @Value("${ADMIN_PASSWORD}") String adminPassword) {
        UserDetails admin = User.builder()
            .username(adminUsername)
            .password(passwordEncoder().encode(adminPassword))
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

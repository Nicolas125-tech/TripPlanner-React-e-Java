package com.nicolas.tripplanner.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

@Configuration
public class EtagConfig {

    // ⚡ Bolt Performance Optimization:
    // Enabled HTTP ETag caching for the application.
    // The ShallowEtagHeaderFilter intercepts responses, calculates an MD5 hash of the payload,
    // and adds it as an ETag header. On subsequent requests, if the client sends the same ETag
    // in the 'If-None-Match' header and the payload hasn't changed, the server returns a
    // 304 Not Modified status with an empty body. This drastically reduces network bandwidth
    // consumption and improves response times for repeated API calls.
    @Bean
    public ShallowEtagHeaderFilter shallowEtagHeaderFilter() {
        return new ShallowEtagHeaderFilter();
    }
}

package com.nicolas.tripplanner.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EtagConfigTest {

    @Test
    void testShallowEtagHeaderFilter() {
        EtagConfig config = new EtagConfig();
        ShallowEtagHeaderFilter filter = config.shallowEtagHeaderFilter();
        assertNotNull(filter, "ShallowEtagHeaderFilter bean should not be null");
    }
}

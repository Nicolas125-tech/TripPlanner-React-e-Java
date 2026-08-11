package com.nicolas.tripplanner;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"ADMIN_USERNAME=admin", "ADMIN_PASSWORD=admin"})
class TripPlannerApplicationTests {

    @Test
    void contextLoads() {
    }

}

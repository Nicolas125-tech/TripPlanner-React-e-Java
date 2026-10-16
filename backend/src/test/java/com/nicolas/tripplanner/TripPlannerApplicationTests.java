package com.nicolas.tripplanner;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(properties = {"ADMIN_USERNAME=admin", "ADMIN_PASSWORD=admin"})
class TripPlannerApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void mainMethodRunsSuccessfully() {
        try (MockedStatic<SpringApplication> springApplicationMock = Mockito.mockStatic(SpringApplication.class)) {
            String[] args = new String[] {};
            TripPlannerApplication.main(args);

            springApplicationMock.verify(() -> SpringApplication.run(TripPlannerApplication.class, args));
        }
    }

    @Test
    void testApplicationInstantiation() {
        TripPlannerApplication application = new TripPlannerApplication();
        assertNotNull(application, "TripPlannerApplication instance should not be null");
    }
}

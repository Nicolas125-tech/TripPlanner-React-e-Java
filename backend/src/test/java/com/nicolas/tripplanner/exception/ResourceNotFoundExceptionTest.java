package com.nicolas.tripplanner.exception;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ResourceNotFoundExceptionTest {

    @Test
    void testMessageConstructor() {
        String expectedMessage = "Resource not found";

        ResourceNotFoundException exception = new ResourceNotFoundException(expectedMessage);

        assertEquals(expectedMessage, exception.getMessage());
        assertNull(exception.getCause());
    }

    @Test
    void testMessageAndCauseConstructor() {
        String expectedMessage = "Resource not found with cause";
        Throwable expectedCause = new RuntimeException("Underlying cause");

        ResourceNotFoundException exception = new ResourceNotFoundException(expectedMessage, expectedCause);

        assertEquals(expectedMessage, exception.getMessage());
        assertSame(expectedCause, exception.getCause());
    }
}

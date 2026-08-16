package com.nicolas.tripplanner.exception;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ApiErrorResponseTest {

    @Test
    void testDefaultConstructor() {
        ApiErrorResponse response = new ApiErrorResponse();

        assertNotNull(response.getTimestamp(), "Timestamp should be initialized to current time");
        assertEquals(0, response.getStatus());
        assertNull(response.getError());
        assertNull(response.getMessage());
        assertNull(response.getPath());
    }

    @Test
    void testParameterizedConstructor() {
        int status = 404;
        String error = "Not Found";
        String message = "Resource not found";
        String path = "/api/resource";

        ApiErrorResponse response = new ApiErrorResponse(status, error, message, path);

        assertNotNull(response.getTimestamp(), "Timestamp should be initialized by constructor chaining");
        assertEquals(status, response.getStatus());
        assertEquals(error, response.getError());
        assertEquals(message, response.getMessage());
        assertEquals(path, response.getPath());
    }

    @Test
    void testGettersAndSetters() {
        ApiErrorResponse response = new ApiErrorResponse();

        LocalDateTime timestamp = LocalDateTime.of(2023, 1, 1, 12, 0);
        int status = 500;
        String error = "Internal Server Error";
        String message = "An unexpected error occurred";
        String path = "/api/unknown";

        response.setTimestamp(timestamp);
        response.setStatus(status);
        response.setError(error);
        response.setMessage(message);
        response.setPath(path);

        assertEquals(timestamp, response.getTimestamp());
        assertEquals(status, response.getStatus());
        assertEquals(error, response.getError());
        assertEquals(message, response.getMessage());
        assertEquals(path, response.getPath());
    }
}

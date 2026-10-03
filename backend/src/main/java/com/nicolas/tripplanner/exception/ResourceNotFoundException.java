package com.nicolas.tripplanner.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    // Override to bypass expensive stack trace generation for control flow exceptions
    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}

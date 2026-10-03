package com.nicolas.tripplanner.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    // ⚡ Bolt Performance Optimization:
    // Bypassing JVM stack trace generation for this business logic exception.
    // Generating a stack trace is an expensive operation. Since ResourceNotFoundException
    // is used primarily for control flow and HTTP 404 responses rather than debugging
    // systemic errors, returning `this` prevents the CPU and memory overhead of
    // traversing and recording the execution stack.
    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}

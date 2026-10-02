package com.nicolas.tripplanner.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    // ⚡ Bolt Performance Optimization:
    // Generating stack traces is an extremely expensive JVM operation.
    // Since ResourceNotFoundException is a business logic exception used to return
    // HTTP 404s (not a system error we need to debug), we override fillInStackTrace
    // to bypass stack trace generation completely. This significantly reduces CPU and
    // memory overhead when this exception is frequently thrown.
    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}

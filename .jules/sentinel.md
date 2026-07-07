## 2026-07-06 - [Fix Information Leakage in Exception Handler]
**Vulnerability:** The GlobalExceptionHandler was leaking internal exception details (e.g. stack traces, internal errors) to the API response in the handleGlobalException method using `ex.getMessage()`.
**Learning:** Returning `ex.getMessage()` for uncontrolled exceptions can expose sensitive architecture information or details that help attackers craft better attacks. This is a common pattern in Spring Boot applications where standard error handling needs explicitly generic responses.
**Prevention:** Catch generic exceptions and return a fixed, generic error string to the user (e.g., "An unexpected internal server error occurred"), while relying on a logger (SLF4J) to record the original exception for internal tracing.

## 2026-07-07 - React Micro-optimization Rejection
**Learning:** Wrapping a simple `Array.prototype.filter` operation in `useMemo` for a small, statically-fetched list of items (like a fallback destination array) is considered a premature micro-optimization. It adds unnecessary complexity and does not resolve a measurable bottleneck, violating strict performance optimization boundaries. Furthermore, automated "clean up" of seemingly unused imports in large monolithic components (like a main `App.jsx` handling routing/layout) is highly dangerous and can easily lead to `ReferenceError` crashes.
**Action:** Focus on structural bottlenecks first (like database indexes or N+1 query problems). Never assume an import is unused just because the Linter says so within a localized view, especially without verifying the full file context and running the complete build/test cycle. Always prefer backend structural optimizations (like JPA `@Index` on queried fields) when the frontend lacks a provably slow rendering path.

## 2026-07-08 - useCallback vs Custom areEqual
**Learning:** When inline functions are passed as props to child components rendered within a large list (like `TripCard` inside `App.jsx`), they defeat standard `React.memo` because the function reference changes on every parent render.
**Action:** Always prioritize `useCallback` in the parent component to pass stable function references to children. If the callback depends on state, use functional state updates (e.g., `setFavorites(prev => ...)`). Moreover, ensure the callback doesn't needlessly depend on external state by passing required contextual information directly from the child (e.g. passing `isCurrentlyFavorite` back to the callback rather than including the whole `favorites` array in the callback's dependencies). This ensures standard `React.memo` works properly and safely prevents O(N) re-renders without stale closure bugs.

## 2026-07-12 - HTTP Compression Threshold Optimization
**Learning:** Enabling HTTP compression is effective, but setting the `min-response-size` too low (e.g., 10 bytes) is an anti-pattern. Compressing very small strings requires CPU cycles and frequently results in a larger payload due to the overhead of compression headers and dictionaries.
**Action:** Always set a reasonable threshold (like 1024 or 2048 bytes) for `server.compression.min-response-size` to ensure we don't waste CPU and increase response sizes for tiny data payloads.

## 2024-07-13 - [Performance Optimization] useMemo for array filtering
**Learning:** For relatively small lists, React.useMemo around Array.prototype.filter gives a decent performance boost by caching the filtered list over consecutive renders if dependencies (`destinations`, `categoryFilter`) do not change.
**Action:** Use `React.useMemo` for filtering operations over arrays to avoid recalculating the filter over each render cycle.
## 2026-07-19 - [Performance Optimization] Colocating Form State
**Learning:** Hoisting highly active state, such as form input keystrokes, to a top-level component like App.jsx causes the entire application tree to unnecessarily re-render on every keystroke.
**Action:** Colocate state associated with forms into dedicated child functional components (e.g., AuthForm, BookingForm) to prevent O(N) re-renders in large top-level components and improve application responsiveness.

## 2024-07-20 - Disable Open Session In View (OSIV)
**Learning:** Spring Boot enables Open Session In View (OSIV) by default, which holds database connections open during the entire HTTP response rendering phase (JSON serialization). This is an anti-pattern that can exhaust the database connection pool under load.
**Action:** Always disable OSIV (`spring.jpa.open-in-view=false`) in the backend's `application.properties` to release database connections immediately after the service layer transaction completes.
## 2026-07-21 - [Performance Optimization] Backend Caching with Spring Cache
**Learning:** For a read-heavy application like this one, frequent calls to read-only endpoints (e.g., getting all trips, getting trips by category) can become a bottleneck as the database grows, even with proper indexes. The database still has to execute the query, fetch results, and Spring has to map those results into objects. This can cause latency and unnecessary CPU load.
**Action:** Implemented caching on the backend service layer using Spring Cache (`@EnableCaching` on the application class, `@Cacheable` on read operations, and `@CacheEvict` on write operations). This intercepts read requests before they hit the database, returning the cached result instantly (O(1) in-memory lookup) and significantly reducing database load. Write operations automatically invalidate the cache so that data stays consistent.
## 2024-07-22 - [Performance Optimization] Cache Key Normalization
**Learning:** When users search, they often type with varying cases or trailing spaces (e.g., "Paris", "paris", " Paris "). If cache keys (both in frontend local maps and backend Spring Cache) use the exact raw string, these variations generate multiple cache misses, triggering redundant API calls and database queries for the same logical search.
**Action:** Always normalize search terms (trim whitespace and convert to lowercase) before generating cache keys or sending them as API parameters. In Spring `@Cacheable`, use a SpEL expression like `key = "#query != null ? #query.trim().toLowerCase() : ''"` to deduplicate these equivalent queries at the service layer.

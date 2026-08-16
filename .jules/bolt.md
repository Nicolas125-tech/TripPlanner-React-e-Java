cat .jules/bolt.md
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
## 2026-07-23 - [Performance Optimization] useMemo for array filtering early return
**Learning:** When using `useMemo` for filtering operations over arrays, adding an early return for simple or empty cases (e.g. `if (categoryFilter === "Todos") return destinations;` or `if (favoriteSet.size === 0) return [];`) improves performance from O(N) to O(1) for those cases. This avoids unnecessary recalculations and maintains referential stability.
**Action:** Always consider early returns in `useMemo` blocks for default or empty states.
## 2026-07-24 - [Performance Optimization] LCP Image Optimization
**Learning:** By default, lazy loading all images (`loading="lazy"`) in lists delays the Largest Contentful Paint (LCP) because the browser waits until layout is complete to fetch above-the-fold images.
**Action:** Always eagerly load (`loading="eager"`) and prioritize (`fetchpriority="high"`) images that are likely to appear above the fold (e.g., the first 2-3 items in a grid/list) to minimize render blocking and fetching delays, significantly improving the LCP metric.
## 2024-08-07 - Add test suite for TripContext
**Learning:** Testing React Context efficiently involves creating a dummy test component that wraps `useContext` to expose its values and functions for interaction and assertion, alongside thoroughly mocking external APIs like `fetch` and browser APIs like `localStorage`.
**Action:** Consistently employ dummy consumer components combined with robust Vitest module/global mocks when asserting logic tightly coupled within custom hooks and providers.

## 2026-08-11 - Add Spring Security authentication for sensitive trip endpoints
**Learning:** Hardcoding default credentials in production configuration files (like `application.properties`) introduces a critical vulnerability (CWE-1188 / CWE-798). Default configurations should be secure by default.
**Action:** When injecting secrets via `@Value`, use environment variables without defaults (e.g., `@Value("${ADMIN_USERNAME}")`) to ensure the application fails to start if not explicitly configured securely by the deployment environment. Provide dummy values in test contexts (e.g., `@SpringBootTest(properties = {...})`) to keep tests running. Always add negative tests (verifying 401 Unauthorized) when adding authentication filters.
## 2024-08-13 - [Performance Optimization] useCallback vs React.memo Completeness
**Learning:** In App.jsx, `performSearch` was correctly wrapped in `useCallback` to provide a stable reference, but the receiving component, `SearchBar`, was not wrapped in `React.memo()`. A stable callback prop is ineffective at preventing re-renders if the child component itself isn't memoized. Thus, `SearchBar` was still re-rendering needlessly whenever `App.jsx` re-rendered.
**Action:** Always ensure that when using `useCallback` to optimize parent-to-child prop passing, the receiving child component is also wrapped in `React.memo()`.

## 2024-08-14 - [Performance Optimization] Modal Re-renders and fetchPriority
**Learning:** React versions prior to 18.3.0 do not fully support the camelCase `fetchPriority` prop and will warn and strip it. Using the lowercase `fetchpriority` acts as a custom attribute workaround, safely passing the LCP hint to the browser. Furthermore, passing inline functions (like `() => setShowModal(false)`) as props to Modals in a top-level component (`App.jsx`) breaks `React.memo` on those Modals, causing O(N) evaluations when unrelated state changes.
**Action:** Use `React.useCallback` for all modal toggle functions in parent components and wrap the child Modal components in `React.memo()`. For React < 18.3.0, strictly use lowercase `fetchpriority` for image LCP optimization.
## 2024-08-16 - [Performance Optimization] useCallback for Modal Toggles
**Learning:** Passing inline arrow functions (e.g., `() => setShowModal(false)`) as props to React Modal components defeats `React.memo()` because the function reference changes on every render of the parent component. This causes Modals to re-render unnecessarily.
**Action:** Extract modal toggle functions into `React.useCallback` hooks with empty dependency arrays `[]` in the parent component and ensure child Modal components are wrapped in `React.memo()`.
## 2024-08-16 - [Performance Optimization] O(1) Lookups with Sets
**Learning:** Using an Array to store and check for existence (e.g., `favorites.includes(id)`) inside a component render cycle results in O(N) time complexity. When this check is performed for every item in a list (e.g., inside `map`), it becomes an O(N*M) operation, severely degrading render performance as lists grow.
**Action:** Migrate such existence-checking state variables from Arrays to Sets (`new Set()`). Checking existence in a Set (`favorites.has(id)`) is O(1), improving the overall render loop complexity to O(N). When persisting to JSON or localStorage, briefly convert the Set back to an array (`[...favorites]`).

## 2026-08-14 - [Performance Optimization] Prevent Full Table Scan in Search
**Learning:** In standard JPA with relational databases like H2, using a leading wildcard in a `LIKE` query (e.g., `LIKE '%query%'`) prevents the database from using B-Tree indexes, forcing a full table scan.
**Action:** If business requirements permit, changing the search strategy to a prefix match (e.g., `LIKE 'query%'`) and ensuring proper indexes exist on the queried columns (e.g., `city` and `country`) allows the database to use index seeks. This reduces algorithmic complexity from O(N) to O(log N) and dramatically speeds up query performance on large tables.
## 2024-08-15 - [Performance Optimization] React.memo missing display name
**Learning:** When optimizing components with `React.memo`, passing an anonymous arrow function (e.g., `React.memo(({ props }) => { ... })`) triggers the ESLint `react/display-name` rule because the component loses its explicit name for debugging tools.
**Action:** Always use a named function expression (e.g., `React.memo(function ComponentName({ props }) { ... })`) when applying `React.memo` to ensure the component maintains a display name and satisfies standard linting configurations.

## 2024-08-15 - [Performance Optimization] Stable props for React.memo
**Learning:** In `App.jsx`, `CategoryPill` was previously receiving an inline arrow function as its `onClick` prop (`onClick={() => setCategoryFilter(cat.label)}`). This caused the reference to change on every parent render, forcing all instances of `CategoryPill` to re-render.
**Action:** When a child component requires a parameter for its callback (like `cat.label`), pass the parameter directly as a prop (`label={cat.label}`) alongside the stable callback reference (`onClick={setCategoryFilter}`). Then, within the child component, wrap the event handler in `React.useCallback` or execute it directly (`onClick(label)`) to ensure `React.memo` effectively prevents O(N) list re-renders.
## 2024-08-16 - [Performance Optimization] Backend Pagination
**Learning:** Returning large, unpaginated lists from database endpoints (e.g., `findAll().stream().map(...)`) consumes massive amounts of backend CPU and memory, stresses the garbage collector, and increases network payload size exponentially. For large datasets, this approach often causes OutOfMemory exceptions or severe latency spikes.
**Action:** Always implement pagination using Spring Data's `Pageable` and `Page` objects. By passing `PageRequest.of(page, size)` to repository methods, the database executes an efficient `LIMIT`/`OFFSET` query, restricting data fetched to exactly what is needed for the user's view, cutting processing time dramatically (e.g., from 14ms down to 7ms on limited datasets, with greater gains on production sets).

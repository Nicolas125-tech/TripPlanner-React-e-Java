🧪 Add test for missing query in search trips

🎯 **What:** The testing gap in `TripController.java` regarding the `searchTrips` endpoint has been addressed.
📊 **Coverage:** A new test `searchTrips_shouldReturnTrips_whenQueryIsMissing` has been added to `TripControllerTest.java` that covers the scenario when the query parameter is omitted (is `null`), validating the correct handling of this edge case in the API endpoint.
✨ **Result:** Test coverage for `TripController` has improved to cover the case where a search query parameter is null, enhancing the reliability of the application's search feature.

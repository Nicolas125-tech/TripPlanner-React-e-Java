# TripPlanner Backend

Backend Spring Boot application for TripPlanner, a travel planning application. This backend is now upgraded to **Java 21 LTS**.

## Features

- RESTful API for managing trips
- Spring Data JPA for database operations
- H2 in-memory database for development
- Request validation with Jakarta Validation
- Global exception handling
- CORS support for frontend integration
- Sample data seeding on startup

## Requirements

- **Java 21 LTS** (or higher)
- Maven 3.6+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Nicolas125-tech/TripPlanner.git
cd TripPlanner/backend
```

2. Build the project:
```bash
mvn clean install
```

## Running the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Get All Trips
```
GET /api/trips
```

### Get Trip by ID
```
GET /api/trips/{id}
```

### Search Trips
```
GET /api/trips/search?query=Paris
```

### Get Trips by Category
```
GET /api/trips/category/{category}
```

### Create Trip
```
POST /api/trips
Content-Type: application/json

{
  "city": "London",
  "country": "United Kingdom",
  "price": 3500.0,
  "rating": 4.6,
  "category": "Cidade",
  "description": "A capital britânica",
  "imageUrl": "https://..."
}
```

### Update Trip
```
PUT /api/trips/{id}
Content-Type: application/json

{
  "city": "London",
  "country": "United Kingdom",
  "price": 3500.0,
  "rating": 4.6,
  "category": "Cidade",
  "description": "A capital britânica",
  "imageUrl": "https://..."
}
```

### Delete Trip
```
DELETE /api/trips/{id}
```

## Database Access

H2 Console is available at `http://localhost:8080/h2-console`

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21 LTS
- **Build Tool**: Maven
- **Database**: H2 (in-memory)
- **ORM**: Jakarta Persistence (JPA)
- **Validation**: Jakarta Validation

## Java 21 Upgrade Information

This project has been upgraded from Java 17 to Java 21 LTS. Java 21 includes several improvements and new features including:
- Record Patterns and Pattern Matching
- Virtual Threads
- Sequenced Collections
- String Templates (Preview)

## License

MIT License

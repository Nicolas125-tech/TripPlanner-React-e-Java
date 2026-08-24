# Stage 1: Build the backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
# Download dependencies (this caches the dependencies in the docker layer)
RUN mvn dependency:go-offline -B
COPY backend/src ./src
# Build the application, skipping tests during docker build
RUN mvn clean package -DskipTests

# Stage 2: Run the backend
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy the built JAR file from the build stage
COPY --from=build /app/target/tripplanner-1.0.0.jar app.jar
# Expose the port (Render sets the PORT env variable automatically, we default to 8080)
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# STAGE 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the application (skipping tests during the build phase to save time)
RUN mvn clean package -DskipTests

# STAGE 2: Run the application using a lightweight Java runtime
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built .jar file from Stage 1 [cite: 63, 65]
COPY --from=build /app/target/*.jar app.jar

# Expose the port Spring Boot runs on [cite: 58, 59]
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
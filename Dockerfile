# Stage 1: Build the application
FROM maven:3.9-amazoncorretto-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
# Cache bust: v3
FROM amazoncorretto:17-alpine-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-Dspring.profiles.active=prod", "-jar", "/app/app.jar"]

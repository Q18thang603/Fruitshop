# Stage 1: Build
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/fruitshopp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD sh -c "java -Dserver.port=${PORT:-8080} -jar app.jar"

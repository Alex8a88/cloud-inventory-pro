# ============================================================
# Cloud Inventory Pro - Backend Dockerfile
# ============================================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Compila directamente sin go-offline
RUN mvn clean package -DskipTests --no-transfer-progress

# ============================================================
# Imagen final
# ============================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
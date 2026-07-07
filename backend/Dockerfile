# ============================================================
# Cloud Inventory Pro - Backend Dockerfile
# Etapa 1: Compilar el proyecto con Maven
# ============================================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copia primero el pom.xml para cachear dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia el código fuente y compila
COPY src ./src
RUN mvn clean package -DskipTests

# ============================================================
# Etapa 2: Imagen final liviana solo con el JAR
# ============================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia el JAR compilado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Puerto que expone el backend
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
# ============================================================
# Cloud Inventory Pro - Frontend Dockerfile
# Etapa 1: Compilar React con Node
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json primero para cachear dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente y compila
COPY . .
RUN npm run build

# ============================================================
# Etapa 2: Servir con Nginx
# ============================================================
FROM nginx:alpine

# Copia el build de React al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de Nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
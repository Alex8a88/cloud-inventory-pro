# Cloud Inventory Pro

Sistema web para administrar el inventario de una tienda tecnológica, desarrollado como proyecto universitario con arquitectura de monolito modular.

## Tecnologías

- **Backend:** Java 21, Spring Boot 3.5.16, Spring Security + JWT, Spring Data JPA, Maven
- **Frontend:** React + Vite, React Router, Axios, CSS Modules
- **Base de datos:** MySQL 8.0
- **DevOps:** Docker, Docker Compose, GitHub Actions, Prometheus, Grafana

## Módulos funcionales

- Autenticación (Login con JWT)
- Dashboard con resumen general
- CRUD de Categorías
- CRUD de Productos (con cálculo automático de stock bajo)
- Registro de Entradas y Salidas de inventario
- Alertas de Stock Bajo
- Reportes: inventario general, movimientos y productos más movidos

## Estructura del proyecto

cloud-inventory-pro/
├── backend/          # API REST con Spring Boot
├── frontend/         # Interfaz web con React + Vite
├── database/         # Scripts SQL (schema.sql)
├── docker/           # docker-compose.yml y configuración de contenedores
├── monitoring/       # Configuración de Prometheus y Grafana
├── docs/             # Documentación adicional
└── .github/          # Workflows de GitHub Actions (CI)

---

## 🚀 Cómo ejecutar el proyecto (con Docker)

### Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git

### Pasos

1. Clona el repositorio:
```bash
   git clone https://github.com/Alex8a88/cloud-inventory-pro.git
   cd cloud-inventory-pro
```

2. Levanta todo el stack desde la carpeta `docker/`:
```bash
   cd docker
   docker compose up --build
```

   La primera vez puede tardar varios minutos mientras descarga las imágenes base y compila el backend y el frontend. Ejecuciones posteriores son mucho más rápidas gracias al cache de Docker.

3. Espera a que todos los servicios estén arriba. Puedes verificarlo en otra terminal con:
```bash
   docker compose ps
```

   Deberías ver los 5 servicios en estado `Up`:

   | Servicio | Descripción | Puerto |
   |---|---|---|
   | `cloud-inventory-mysql` | Base de datos | `3307` (host) → `3306` (contenedor) |
   | `cloud-inventory-backend` | API REST Spring Boot | `8080` |
   | `cloud-inventory-frontend` | Interfaz React (servida con Nginx) | `80` |
   | `cloud-inventory-prometheus` | Recolección de métricas | `9090` |
   | `cloud-inventory-grafana` | Dashboards de monitoreo | `3000` |

4. Accede a la aplicación:
   - **Frontend:** [http://localhost](http://localhost)
   - **Backend (health check):** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
   - **Prometheus:** [http://localhost:9090](http://localhost:9090)
   - **Grafana:** [http://localhost:3000](http://localhost:3000) — usuario `admin`, contraseña `admin123`

### Credenciales de acceso a la aplicación

Usuario: admin
Contraseña: admin123

### Detener el proyecto

```bash
docker compose down
```

Para eliminar también los volúmenes (borra los datos de MySQL y Grafana):
```bash
docker compose down -v
```

---

## 🔧 Ejecutar en modo desarrollo (sin Docker)

Si prefieres correr backend y frontend por separado durante desarrollo:

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Requiere una instancia de MySQL corriendo localmente con la base `cloud_inventory_pro` (ver `database/schema.sql`) y las variables de entorno configuradas en `application.properties`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El servidor de desarrollo de Vite corre por defecto en `http://localhost:5173`.

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Autenticación, devuelve JWT |
| GET/POST/PUT/DELETE | `/api/categorias` | CRUD de categorías |
| GET/POST/PUT/DELETE | `/api/productos` | CRUD de productos |
| GET | `/api/productos/stock-bajo` | Productos con stock bajo |
| GET/POST | `/api/movimientos` | Entradas y salidas de inventario |
| GET | `/api/movimientos/producto/{id}` | Movimientos por producto |
| GET | `/api/alertas` | Listado de alertas |
| GET | `/api/alertas/resumen` | Resumen de alertas para dashboard |
| GET | `/api/reportes/inventario` | Reporte de inventario general |
| GET | `/api/reportes/movimientos` | Reporte de movimientos |
| GET | `/api/reportes/productos-mas-movidos` | Productos con más movimientos |

Todos los endpoints (excepto `/api/auth/login`) requieren el header:

Authorization: Bearer <token>

---

## 🔄 Integración Continua (CI)

El proyecto usa **GitHub Actions** para validar automáticamente que el código compile correctamente en cada push y pull request.

**Workflow:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

**Se ejecuta en:**
- Push a cualquier rama
- Pull requests hacia `main`

**Qué valida:**
1. **Backend:** compila con Maven (JDK 21) y genera el `.jar`
2. **Frontend:** instala dependencias y compila con Vite

Puedes ver el historial de ejecuciones en la pestaña [Actions](https://github.com/Alex8a88/cloud-inventory-pro/actions) del repositorio.

---

## 📊 Monitoreo (Prometheus + Grafana)

El backend expone métricas en formato Prometheus a través de Spring Boot Actuator + Micrometer, en el endpoint `/actuator/prometheus`.

### Prometheus

Configurado en [`monitoring/prometheus.yml`](monitoring/prometheus.yml), scrapea el backend cada 15 segundos. Puedes ver el estado de los targets en:

http://localhost:9090/targets

### Grafana

Al levantar el stack con Docker, Grafana ya viene con:
- El datasource de Prometheus preconfigurado (provisioning automático)
- Un dashboard pre-cargado: **"Cloud Inventory Pro - Backend Monitoring"**

El dashboard incluye:
- Estado del servicio (UP/DOWN)
- Uso de memoria JVM (heap)
- Requests HTTP por segundo, por endpoint
- Latencia p95 de las peticiones
- Conexiones activas/inactivas del pool de MySQL (HikariCP)

Accede en [http://localhost:3000](http://localhost:3000) → menú lateral → **Dashboards**.

---

## 🐛 Solución de problemas comunes

**El build de Docker falla descargando dependencias de Maven / se corta a mitad de descarga:**
Generalmente es un problema de red local, no del proyecto. Prueba:
```bash
wsl --shutdown
```
Reinicia Docker Desktop y vuelve a intentar. Si persiste, revisa que tu antivirus no esté inspeccionando el tráfico HTTPS hacia `docker.io` / `auth.docker.io`, y desactiva temporalmente cualquier VPN activa.

**El backend no conecta a MySQL al arrancar:**
El `docker-compose.yml` ya incluye un `healthcheck` en el servicio de MySQL y `depends_on: condition: service_healthy` en el backend, para que este último espere a que la base de datos esté lista antes de arrancar. Si aun así falla, revisa los logs con:
```bash
docker compose logs mysql
docker compose logs backend
```

**`curl` en PowerShell se comporta raro (pide confirmación, no reconoce `-X` o `-H`):**
PowerShell tiene un alias de `curl` que en realidad ejecuta `Invoke-WebRequest`. Usa `curl.exe` en lugar de `curl` para forzar el binario real.

---

## 👤 Autor

**Alex8a88**


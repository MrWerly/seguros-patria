# Seguros Patria - API REST

API REST para gestión de clientes y pólizas de seguro.  
Stack: **Node.js + Express + PostgreSQL + JWT**

---

## Requisitos

- **Con Docker:** Docker y Docker Compose (recomendado)
- **Sin Docker:** Node.js 20+ y PostgreSQL 16+

---

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de la base de datos | `seguros_user` |
| `DB_PASSWORD` | Contraseña de la base de datos | `change_me` |
| `DB_NAME` | Nombre de la base de datos | `seguros_patria` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `change_me` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `8h` |
| `PORT` | Puerto en que escucha la API | `3000` |
| `ADMIN_USERNAME` | Nombre del usuario administrador inicial | `admin` |
| `ADMIN_PASSWORD` | Contraseña del usuario administrador inicial | `change_me` |

> **Importante:** `JWT_SECRET`, `ADMIN_USERNAME` y `ADMIN_PASSWORD` son obligatorias. La app no arrancará sin `JWT_SECRET` y no creará el usuario admin si faltan las otras dos.

---

## Cómo ejecutar

### Con Docker Compose (recomendado)

```bash
docker-compose up --build
```

Docker levanta PostgreSQL, ejecuta `schema.sql`, crea el usuario admin y arranca la API.  
La API queda disponible en `http://localhost:3000`.

### Ejecución local (sin Docker)

1. Creá la base de datos en PostgreSQL:
   ```bash
   psql -U postgres -c "CREATE DATABASE seguros_patria;"
   psql -U postgres -d seguros_patria -f schema.sql
   ```

2. Instalá dependencias:
   ```bash
   npm install
   ```

3. Configurá `.env` con `DB_HOST=localhost` y las credenciales de tu PostgreSQL local.

4. Iniciá la API:
   ```bash
   npm start
   ```

---

## Endpoints

### Autenticación

| Método | Ruta | Auth |
|---|---|---|
| POST | `/auth/login` | No |

### Clientes

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/clientes` | Crear un cliente | JWT |
| GET | `/clientes` | Listar todos los clientes | JWT |
| GET | `/clientes/resumen` | Resumen con cantidad de pólizas y monto total por cliente | JWT |

### Pólizas

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/polizas` | Crear una póliza | JWT |
| GET | `/polizas` | Listar todas las pólizas | JWT |

### Health check

| Método | Ruta | Auth |
|---|---|---|
| GET | `/health` | No |

---

## Ejemplos con curl

### 1. Login — obtener token

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "tu_password_admin"}'
```

Respuesta:
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

Guardá el token en una variable para los siguientes requests:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Crear un cliente

```bash
curl -s -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre": "Ana López", "documento": "30456789", "email": "ana@email.com"}'
```

### 3. Listar clientes

```bash
curl -s http://localhost:3000/clientes \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Resumen de clientes

```bash
curl -s http://localhost:3000/clientes/resumen \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Crear una póliza

```bash
curl -s -X POST http://localhost:3000/polizas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"numero_poliza": "POL-001", "cliente_id": 1, "fecha_emision": "2026-06-14", "monto_asegurado": 75000}'
```

### 6. Listar pólizas

```bash
curl -s http://localhost:3000/polizas \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Health check

```bash
curl -s http://localhost:3000/health
```

---

## Validaciones

- **Clientes:** `nombre`, `documento` y `email` son obligatorios, se aplica trim, y el email debe tener formato válido. `documento` y `email` son únicos (409 si ya existen).
- **Pólizas:** `numero_poliza` (único), `cliente_id` (entero positivo, debe existir), `fecha_emision` (fecha válida YYYY-MM-DD), `monto_asegurado` (número finito > 0).
- Errores de validación devuelven **400**. Recurso no encontrado devuelve **404**. Duplicado devuelve **409**.

---

## Estructura del proyecto

```
seguros-patria/
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── db.js
│   │   └── seeder.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── clientes.controller.js
│   │   └── polizas.controller.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.routes.js
│       ├── clientes.routes.js
│       └── polizas.routes.js
├── schema.sql
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

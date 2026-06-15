# Seguros Patria - API REST

API REST para gestión de clientes y pólizas.  
Stack: **Node.js + Express + PostgreSQL + JWT**

---

## Requisitos

- Docker y Docker Compose

---

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=patria_seguros

JWT_SECRET=tu_secreto_seguro_aqui
JWT_EXPIRES_IN=8h

PORT=3000
```

---

## Cómo ejecutar el proyecto

```bash
docker-compose up --build
```

Eso es todo. Docker levanta la base de datos, crea las tablas y arranca el servidor automáticamente.

El servidor queda disponible en `http://localhost:3000`.

### Usuario de prueba

| username | password  |
|----------|-----------|
| admin    | admin123  |

---

## Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /auth/login | Obtener token JWT | No |

**Body:**
```json
{ "username": "admin", "password": "admin123" }
```

---

### Clientes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /clientes | Crear un cliente |
| GET | /clientes | Listar clientes |
| GET | /clientes/resumen | Resumen con cantidad de pólizas y monto total |

**POST /clientes — Body:**
```json
{
  "nombre": "Juan Perez",
  "documento": "12345678",
  "email": "juan@email.com"
}
```

---

### Pólizas

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /polizas | Crear una póliza |
| GET | /polizas | Listar pólizas |

**POST /polizas — Body:**
```json
{
  "numero_poliza": "POL-001",
  "cliente_id": 1,
  "fecha_emision": "2026-06-14",
  "monto_asegurado": 50000
}
```

---

## Autenticación

Todos los endpoints de `/clientes` y `/polizas` requieren el header:

```
Authorization: Bearer <token>
```
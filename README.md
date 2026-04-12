[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6upg9zOS)

# Taller Express V2: JWT Authentication REST API

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una **REST API** con autenticación basada en **JSON Web Tokens (JWT)** y control de acceso por roles. La API fue construida con **Node.js** y **Express**, desplegada en **Vercel** y sigue una arquitectura en capas (rutas, controladores y middleware).

---

## ¿Qué se pidió?

Construir una API REST con las siguientes especificaciones:

### Endpoint de autenticación — `POST /login`
- Si las credenciales son **correctas** → `[200]` `{ token: "token..." }`
- Si las credenciales son **incorrectas** → `[400]` `{ message: "Invalid credentials" }`

### Endpoint protegido por rol — `POST /request`
| Rol | Respuesta |
|-----|-----------|
| `ADMIN` | `[200]` `{ message: "Hi from ADMIN" }` |
| `USER` | `[200]` `{ message: "Hi from USER" }` |
| Cualquier otro | `[401]` `{ message: "You're not allowed to do this" }` |

---

## Arquitectura del Proyecto

```
auth-api/
├── src/
│   ├── controllers/
│   │   ├── authController.js      ← Lógica de login y firma del JWT
│   │   └── requestController.js   ← Respuestas según el rol del usuario
│   ├── middleware/
│   │   └── authMiddleware.js      ← Verificación del token JWT
│   └── app.js                     ← Configuración de Express y rutas
├── .env                           ← Variables de entorno (no se sube a GitHub)
├── .gitignore                     ← Excluye node_modules/ y .env
├── vercel.json                    ← Configuración de despliegue en Vercel
└── package.json                   ← Dependencias y scripts
```

### Capas de la arquitectura

- **`app.js`** — Punto de entrada. Configura Express, carga variables de entorno y registra las rutas.
- **Controllers** — Contienen la lógica de negocio: validar credenciales, firmar el JWT y responder según el rol.
- **Middleware** — Intercepta las peticiones al endpoint protegido, verifica el token y adjunta el payload a `req.user`.
- **Variables de entorno** — `JWT_SECRET` nunca está hardcodeado; se lee siempre desde `process.env`.

---

## Paso a Paso del Desarrollo

### 1. Inicialización del proyecto

```bash
mkdir auth-api && cd auth-api
npm init -y
npm install express jsonwebtoken dotenv
```

### 2. Configuración de variables de entorno

Se creó el archivo `.env` con las variables necesarias:

```env
JWT_SECRET=my_super_secret_key
PORT=3000
```

Este archivo **nunca se sube a GitHub** — está listado en `.gitignore`.

### 3. Desarrollo del endpoint `POST /login`

El controlador `authController.js` busca al usuario en la lista de usuarios, y si las credenciales coinciden firma un JWT con su `id`, `username` y `role`. Si no coinciden responde con `400`.

### 4. Desarrollo del middleware de autenticación

El archivo `authMiddleware.js` extrae el token del header `Authorization: Bearer <token>`, lo verifica con `jwt.verify()` usando `process.env.JWT_SECRET`, y si es válido adjunta el payload decodificado a `req.user`.

### 5. Desarrollo del endpoint `POST /request`

El controlador `requestController.js` lee `req.user.role` (puesto ahí por el middleware) y responde con el mensaje correspondiente según el rol: `ADMIN`, `USER`, o `401` para cualquier otro caso.

### 6. Configuración para Vercel

Se creó `vercel.json` para indicarle a Vercel que el proyecto es una API de Node.js y que todas las rutas deben ser manejadas por `app.js`.

### 7. Despliegue

El proyecto fue subido a GitHub y conectado a Vercel. La variable `JWT_SECRET` fue configurada directamente en el dashboard de Vercel (Settings → Environment Variables).

---

## Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| Node.js | Runtime de JavaScript |
| Express | Framework HTTP para crear la API |
| jsonwebtoken | Firma y verificación de tokens JWT |
| dotenv | Carga de variables de entorno en local |
| Vercel | Plataforma de despliegue |

---

## Cómo Ejecutarlo Localmente

### Requisitos previos
- Node.js v18 o superior
- Git

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/DSAW-2026-1/taller-express-v2-sin-manos-fc.git
cd taller-express-v2-sin-manos-fc
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Crear el archivo `.env`**
```env
JWT_SECRET=my_super_secret_key
PORT=3000
```

**4. Iniciar el servidor**
```bash
npm run dev
```

El servidor correrá en `http://localhost:3000`.

---

## Cómo Probarlo

Usa **Postman** o cualquier cliente HTTP.

### Test 1 — Login válido como ADMIN
```
POST http://localhost:3000/login
Body (JSON):
{
  "username": "admin",
  "password": "admin123"
}
```
Respuesta esperada `200`:
```json
{ "token": "eyJ..." }
```

### Test 2 — Login válido como USER
```
POST http://localhost:3000/login
Body (JSON):
{
  "username": "user",
  "password": "user123"
}
```
Respuesta esperada `200`:
```json
{ "token": "eyJ..." }
```

### Test 3 — Login inválido
```
POST http://localhost:3000/login
Body (JSON):
{
  "username": "admin",
  "password": "wrong"
}
```
Respuesta esperada `400`:
```json
{ "message": "Invalid credentials" }
```

### Test 4 — Consulta con rol ADMIN
```
POST http://localhost:3000/request
Headers:
  Authorization: Bearer <token del test 1>
```
Respuesta esperada `200`:
```json
{ "message": "Hi from ADMIN" }
```

### Test 5 — Consulta con rol USER
```
POST http://localhost:3000/request
Headers:
  Authorization: Bearer <token del test 2>
```
Respuesta esperada `200`:
```json
{ "message": "Hi from USER" }
```

### Test 6 — Sin token
```
POST http://localhost:3000/request
(sin header Authorization)
```
Respuesta esperada `401`:
```json
{ "message": "You're not allowed to do this" }
```

---

## Usuarios de Prueba

| Username | Password | Rol |
|---|---|---|
| `admin` | `admin123` | `ADMIN` |
| `user` | `user123` | `USER` |

---

## Despliegue en Vercel

La API está desplegada y disponible en:

🔗 **`https://taller-express-v2-sin-manos-fc.vercel.app`**

---

Tarea hecha por: **Andres Felipe Ramos Pineda y Juan Felipe Mahecha**

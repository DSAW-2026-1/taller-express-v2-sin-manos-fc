# Taller Express V2: JWT Authentication REST API

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una **REST API** con autenticación basada en **JSON Web Tokens (JWT)** y control de acceso por roles. La API fue construida con **Node.js** y **Express**, desplegada en **Vercel** y sigue una arquitectura en capas (rutas, controladores y middleware). Incluye documentación interactiva con **Swagger UI** accesible desde el navegador.

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
taller-express-v2-sin-manos-fc/
├── src/
│   ├── controllers/
│   │   ├── authController.js      ← Lógica de login y firma del JWT
│   │   └── requestController.js   ← Respuestas según el rol del usuario
│   ├── middleware/
│   │   └── authMiddleware.js      ← Verificación del token JWT
│   └── app.js                     ← Express, rutas, Swagger UI y health check
├── .env                           ← Variables de entorno (no se sube a GitHub)
├── .gitignore                     ← Excluye node_modules/ y .env
├── vercel.json                    ← Configuración de despliegue en Vercel
└── package.json                   ← Dependencias y scripts
```

### Capas de la arquitectura

- **`app.js`** — Punto de entrada. Configura Express, carga variables de entorno, registra las rutas y sirve la documentación Swagger.
- **Controllers** — Contienen la lógica de negocio: validar credenciales, firmar el JWT y responder según el rol.
- **Middleware** — Intercepta las peticiones al endpoint protegido, verifica el token y adjunta el payload a `req.user`.
- **Variables de entorno** — `JWT_SECRET` nunca está hardcodeado; se lee siempre desde `process.env`.
- **Swagger UI** — Documentación interactiva servida en `/docs` usando CDN, sin dependencias adicionales en producción.

---

## Paso a Paso del Desarrollo

### 1. Inicialización del proyecto

```bash
mkdir taller-express-v2-sin-manos-fc && cd taller-express-v2-sin-manos-fc
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

Se creó `vercel.json` con una ruta comodín `/(.*)`  para que Express maneje todas las rutas:

```json
{
  "version": 2,
  "builds": [{ "src": "src/app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/app.js" }]
}
```

### 7. Ruta raíz y Swagger UI

Se agregaron rutas extra en `app.js`:

- `GET /` — Health check que confirma que la API está corriendo.
- `GET /docs` — Documentación interactiva Swagger UI servida vía CDN.
- `GET /swagger.json` — Especificación OpenAPI 3.0 en formato JSON.

### 8. Despliegue

El proyecto fue subido a GitHub y conectado a Vercel. La variable `JWT_SECRET` fue configurada directamente en el dashboard de Vercel (Settings → Environment Variables).

---

## Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| Node.js | Runtime de JavaScript |
| Express | Framework HTTP para crear la API |
| jsonwebtoken | Firma y verificación de tokens JWT |
| dotenv | Carga de variables de entorno en local |
| Swagger UI (CDN) | Documentación interactiva de los endpoints |
| Vercel | Plataforma de despliegue |

---

## Endpoints Disponibles

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | No | Health check — confirma que la API está viva |
| `GET` | `/docs` | No | Documentación interactiva Swagger UI |
| `GET` | `/swagger.json` | No | Especificación OpenAPI en JSON |
| `POST` | `/login` | No | Login — devuelve token JWT |
| `POST` | `/request` | Sí (Bearer) | Respuesta según el rol del token |

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

**5. Abrir la documentación**

Abre en el navegador: `http://localhost:3000/docs`

---

## Cómo Probarlo

### Opción 1 — Swagger UI (recomendada, sin instalar nada)

Abre en el navegador:

🔗 **`https://taller-express-v2-sin-manos-fc.vercel.app/docs`**

Desde ahí puedes ejecutar todos los endpoints directamente con botones, sin necesidad de Postman ni ninguna otra herramienta.

### Opción 2 — Postman o cualquier cliente HTTP

**Test 1 — Login válido como ADMIN**
```
POST https://taller-express-v2-sin-manos-fc.vercel.app/login
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

**Test 2 — Login válido como USER**
```
POST https://taller-express-v2-sin-manos-fc.vercel.app/login
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

**Test 3 — Login inválido**
```
POST https://taller-express-v2-sin-manos-fc.vercel.app/login
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

**Test 4 — Consulta con rol ADMIN**
```
POST https://taller-express-v2-sin-manos-fc.vercel.app/request
Headers:
  Authorization: Bearer <token del test 1>
```
Respuesta esperada `200`:
```json
{ "message": "Hi from ADMIN" }
```

**Test 5 — Consulta con rol USER**
```
POST https://taller-express-v2-sin-manos-fc.vercel.app/request
Headers:
  Authorization: Bearer <token del test 2>
```
Respuesta esperada `200`:
```json
{ "message": "Hi from USER" }
```

**Test 6 — Sin token**
```
POST https://taller-express-v2-sin-manos-fc.vercel.app/request
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

📄 **Documentación interactiva:** `https://taller-express-v2-sin-manos-fc.vercel.app/docs`

---

Tarea hecha por: **Andres Felipe Ramos Pineda y Juan Felipe Mahecha**
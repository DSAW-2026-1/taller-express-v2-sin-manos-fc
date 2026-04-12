import express from 'express';
import dotenv from 'dotenv';
import { login } from './controllers/authController.js';
import { authenticate } from './middleware/authMiddleware.js';
import { handleRequest } from './controllers/requestController.js';

dotenv.config();

const app = express();
app.use(express.json());

// Swagger UI served via CDN — no package needed
app.get('/docs', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>JWT Auth API - Docs</title>
  <meta charset="utf-8"/>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
<script>
SwaggerUIBundle({
  url: '/swagger.json',
  dom_id: '#swagger-ui',
  presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
  layout: 'BaseLayout'
});
</script>
</body>
</html>`);
});

// Swagger JSON spec
app.get('/swagger.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: { title: 'JWT Auth API', version: '1.0.0', description: 'Taller Express V2 — JWT authentication and role-based access' },
    servers: [{ url: 'https://taller-express-v2-sin-manos-fc.vercel.app' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
    },
    paths: {
      '/login': {
        post: {
          summary: 'Login and get a JWT token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: {
              username: { type: 'string', example: 'admin' },
              password: { type: 'string', example: 'admin123' }
            }}}}
          },
          responses: {
            200: { description: '{ token: "eyJ..." }' },
            400: { description: '{ message: "Invalid credentials" }' }
          }
        }
      },
      '/request': {
        post: {
          summary: 'Role-based protected endpoint',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: '{ message: "Hi from ADMIN" } or { message: "Hi from USER" }' },
            401: { description: '{ message: "You\'re not allowed to do this" }' }
          }
        }
      }
    }
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'JWT Auth API is running',
    docs: 'https://taller-express-v2-sin-manos-fc.vercel.app/docs',
    endpoints: { login: 'POST /login', request: 'POST /request' }
  });
});

app.post('/login', login);
app.post('/request', authenticate, handleRequest);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
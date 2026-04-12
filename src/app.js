import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { login } from './controllers/authController.js';
import { authenticate } from './middleware/authMiddleware.js';
import { handleRequest } from './controllers/requestController.js';

dotenv.config();

const app = express();
app.use(express.json());

// Swagger definition
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'JWT Auth API',
    version: '1.0.0',
    description: 'REST API with JWT authentication and role-based access — Taller Express V2',
  },
  servers: [{ url: 'https://taller-express-v2-sin-manos-fc.vercel.app' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/login': {
      post: {
        summary: 'Login and get a JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'admin' },
                  password: { type: 'string', example: 'admin123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Returns a JWT token', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' } } } } } },
          400: { description: 'Invalid credentials' },
        },
      },
    },
    '/request': {
      post: {
        summary: 'Role-based protected endpoint',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Hi from ADMIN or Hi from USER' },
          401: { description: "You're not allowed to do this" },
        },
      },
    },
  },
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'JWT Auth API is running',
    docs: 'https://taller-express-v2-sin-manos-fc.vercel.app/docs',
    endpoints: { login: 'POST /login', request: 'POST /request' },
  });
});

app.post('/login', login);
app.post('/request', authenticate, handleRequest);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
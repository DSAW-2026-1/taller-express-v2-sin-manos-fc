import express from 'express';
import dotenv from 'dotenv';
import { login } from './controllers/authController.js';
import { authenticate } from './middleware/authMiddleware.js';
import { handleRequest } from './controllers/requestController.js';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/login', login);
app.post('/request', authenticate, handleRequest);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;


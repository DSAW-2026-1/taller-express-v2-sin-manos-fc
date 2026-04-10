import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

// Load environment variables from .env (only works locally)
// On Vercel, variables are set through the dashboard
dotenv.config();

const app = express();

// Parse incoming JSON bodies
app.use(express.json());

// Routes
app.use('/login', authRoutes);       // POST /login
app.use('/request', requestRoutes);  // POST /request

// Local server startup
// On Vercel this block is ignored — Vercel uses the exported app directly
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Export for Vercel
export default app;

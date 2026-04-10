import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/', login); // POST /login

export default router;
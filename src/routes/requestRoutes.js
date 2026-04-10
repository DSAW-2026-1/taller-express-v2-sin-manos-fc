import express from 'express';
import { handleRequest } from '../controllers/requestController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, handleRequest); // GET /request

export default router;
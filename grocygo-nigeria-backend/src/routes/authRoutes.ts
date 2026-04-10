import { Router } from 'express';
import { register, login, googleAuth } from '../controllers/authController';

const router = Router();

// Endpoint: POST /api/auth/register
router.post('/register', register);

// Endpoint: POST /api/auth/login
router.post('/login', login);

// Endpoint: POST /api/auth/google
router.post('/google', googleAuth);

export default router;
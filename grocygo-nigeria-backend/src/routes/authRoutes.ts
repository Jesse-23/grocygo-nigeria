import { Router } from 'express';
import { register, login, googleAuth, getProfile, updateProfile, changePassword } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Endpoint: POST /api/auth/register
router.post('/register', register);

// Endpoint: POST /api/auth/login
router.post('/login', login);

// Endpoint: POST /api/auth/google
router.post('/google', googleAuth);

// Protected route: req.user is set inside verifyToken
router.get('/me', verifyToken, getProfile);

// Protected route for updating user profile
router.put('/update-profile', verifyToken, updateProfile);

// Protected route for changing password
router.put('/change-password', verifyToken, changePassword);

export default router;
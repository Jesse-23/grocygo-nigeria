import { Router } from 'express';
import { getAdminStats } from '../controllers/adminController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// In a real app, you'd add an isAdmin middleware here too!
router.get('/stats', verifyToken, getAdminStats);

export default router;
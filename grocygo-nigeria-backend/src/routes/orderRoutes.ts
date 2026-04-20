import { Router } from 'express';
import { placeOrder } from '../controllers/orderController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// This route is protected - only logged in users can checkout
router.post('/checkout', verifyToken, placeOrder);

export default router;
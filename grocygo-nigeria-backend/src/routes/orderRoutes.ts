import { Router } from 'express';
import { placeOrder, getMyOrders } from '../controllers/orderController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * Endpoint: POST /api/orders/checkout
 * Purpose: Process a new order and reduce product stock
 */
router.post('/checkout', verifyToken, placeOrder);

/**
 * Endpoint: GET /api/orders/my-orders
 * Purpose: Fetch order history for the logged-in user
 */
router.get('/my-orders', verifyToken, getMyOrders);

export default router;
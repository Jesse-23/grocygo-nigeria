import { Router } from 'express';
import { 
  getAdminStats, 
  getRecentOrders, 
  updateOrderStatus 
} from '../controllers/adminController';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * DASHBOARD STATS
 * GET /api/admin/stats
 */
router.get('/stats', verifyToken, verifyAdmin, getAdminStats);

/**
 * ORDER MANAGEMENT
 * GET /api/admin/orders - Fetch all recent shop orders
 */
router.get('/orders', verifyToken, verifyAdmin, getRecentOrders);

/**
 * STATUS UPDATES
 * PATCH /api/admin/orders/:id/status - Update a specific order status
 */
router.patch('/orders/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

export default router;
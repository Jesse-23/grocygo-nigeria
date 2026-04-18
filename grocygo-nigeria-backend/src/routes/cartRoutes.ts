import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);
router.delete('/:productId', verifyToken, removeFromCart);

export default router;
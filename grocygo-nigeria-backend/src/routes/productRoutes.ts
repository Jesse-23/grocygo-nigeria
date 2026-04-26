import { Router } from 'express';
import { getProducts, createProduct, deleteProduct } from '../controllers/productController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// GET /api/products - Public: Anyone can view groceries
router.get('/', getProducts);

// POST /api/products - Protected: Only logged-in users (Admins) can add stock
router.post('/', verifyToken, createProduct);

// DELETE /api/products/:id - Protected: Only logged-in users (Admins) can remove products
router.delete('/:id', verifyToken, deleteProduct);

export default router;
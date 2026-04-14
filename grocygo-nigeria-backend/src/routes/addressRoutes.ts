import { Router } from 'express';
import { getAddresses, addAddress } from '../controllers/addressController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// All address routes should be protected by verifyToken
router.get('/', verifyToken, getAddresses);
router.post('/', verifyToken, addAddress);

export default router;
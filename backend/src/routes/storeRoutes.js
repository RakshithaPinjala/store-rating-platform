import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getStoresForUser, rateStore } from '../controllers/storeController.js';

const router = express.Router();

router.get('/', authenticateToken, getStoresForUser);
router.post('/:storeId/rate', authenticateToken, rateStore);

export default router;

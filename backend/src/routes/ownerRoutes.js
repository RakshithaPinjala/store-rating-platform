import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { getOwnerDashboard } from '../controllers/ownerController.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('STORE_OWNER'), getOwnerDashboard);

export default router;

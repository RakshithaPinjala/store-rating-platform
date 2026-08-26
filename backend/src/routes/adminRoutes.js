import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { getDashboardStats, createUser, createStore, getUsers, getStores, getUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard-stats', authenticateToken, authorizeRoles('ADMIN'), getDashboardStats);
router.post('/users', authenticateToken, authorizeRoles('ADMIN'), createUser);
router.post('/stores', authenticateToken, authorizeRoles('ADMIN'), createStore);
router.get('/users', authenticateToken, authorizeRoles('ADMIN'), getUsers);
router.get('/stores', authenticateToken, authorizeRoles('ADMIN'), getStores);
router.get('/users/:id', authenticateToken, authorizeRoles('ADMIN'), getUser);

export default router;

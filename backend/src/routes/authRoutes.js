import express from 'express';
import { signup, login, updatePassword } from '../controllers/authController.js';
import { validateRegister, validatePasswordUpdate } from '../middleware/validateInput.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', validateRegister, signup);
router.post('/login', login);
router.patch('/update-password', authenticateToken, validatePasswordUpdate, updatePassword);

export default router;

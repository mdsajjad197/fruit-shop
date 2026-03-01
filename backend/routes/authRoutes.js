import express from 'express';
const router = express.Router();
import {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
} from '../controllers/authController.js';
import { protect, blockCheck } from '../middleware/authMiddleware.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, blockCheck, getMe);
router.put('/profile', protect, blockCheck, updateProfile);

router.post('/addresses', protect, blockCheck, addAddress);
router.put('/addresses/:id', protect, blockCheck, updateAddress);
router.delete('/addresses/:id', protect, blockCheck, deleteAddress);

export default router;

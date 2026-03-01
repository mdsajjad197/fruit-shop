import express from 'express';
const router = express.Router();
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    getDashboardStats,
    deleteOrder,
} from '../controllers/orderController.js';
import { protect, blockCheck, adminOnly } from '../middleware/authMiddleware.js';

// Private user routes
router.post('/', protect, blockCheck, createOrder);
router.get('/my', protect, blockCheck, getMyOrders);
router.put('/:id/cancel', protect, blockCheck, cancelOrder);

// Admin routes
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

// Shared (owner or admin)
router.get('/:id', protect, blockCheck, getOrderById);

export default router;

import express from 'express';
const router = express.Router();
import { getAllUsers, toggleBlockUser, deleteUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/block', protect, adminOnly, toggleBlockUser);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;

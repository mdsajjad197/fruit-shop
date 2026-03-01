import express from 'express';
import { submitFeedback, getFeedback, markFeedbackRead, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, submitFeedback)
    .get(protect, adminOnly, getFeedback);

router.route('/:id/read')
    .put(protect, adminOnly, markFeedbackRead);

router.route('/:id')
    .delete(protect, adminOnly, deleteFeedback);

export default router;

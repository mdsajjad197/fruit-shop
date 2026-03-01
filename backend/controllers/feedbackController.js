import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = asyncHandler(async (req, res) => {
    const { rating, message } = req.body;

    if (!rating || !message) {
        res.status(400);
        throw new Error('Please provide rating and message.');
    }

    const feedback = await Feedback.create({
        user: req.user._id,
        rating,
        message,
    });

    const populatedFeedback = await Feedback.findById(feedback._id).populate('user', 'name email');

    // Emit real-time alert to admin via Socket.io
    const io = req.app.get('io');
    if (io) {
        io.to('admin-room').emit('newFeedback', populatedFeedback);
    }

    res.status(201).json({ success: true, feedback });
});

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Admin
export const getFeedback = asyncHandler(async (req, res) => {
    const feedbackList = await Feedback.find({})
        .sort({ createdAt: -1 })
        .populate('user', 'name email');

    res.json({ success: true, feedbackList });
});

// @desc    Mark feedback as read
// @route   PUT /api/feedback/:id/read
// @access  Admin
export const markFeedbackRead = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error('Feedback not found.');
    }

    feedback.isRead = true;
    await feedback.save();

    res.json({ success: true, feedback });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Admin
export const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error('Feedback not found.');
    }

    await feedback.deleteOne();
    res.json({ success: true, message: 'Feedback removed' });
});

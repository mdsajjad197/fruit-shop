import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'user' };
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({ success: true, total, users });
});

// @desc    Block / Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Admin
export const toggleBlockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }
    if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot block an admin account.');
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
        success: true,
        message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
        isBlocked: user.isBlocked,
    });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }
    if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete an admin account.');
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully.' });
});

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all required fields.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists.');
    }

    const user = await User.create({ name, email, password });
    generateToken(res, user._id);

    res.status(201).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password.');
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password.');
    }

    if (user.isBlocked) {
        res.status(403);
        throw new Error('Your account is blocked. Contact support.');
    }

    generateToken(res, user._id);

    res.json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
        },
    });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.json({ success: true, message: 'Logged out successfully.' });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    if (req.body.password) {
        if (req.body.password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters.');
        }
        user.password = req.body.password;
    }

    const updated = await user.save();
    res.json({
        success: true,
        user: {
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            addresses: updated.addresses,
        },
    });
});

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Update address
// @route   PUT /api/auth/addresses/:id
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) {
        res.status(404);
        throw new Error('Address not found.');
    }
    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
        (a) => a._id.toString() !== req.params.id
    );
    await user.save();
    res.json({ success: true, addresses: user.addresses });
});

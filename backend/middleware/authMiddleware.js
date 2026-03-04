import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Verify JWT from HTTP-only cookie
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized. No token found.');
    }



    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            throw new Error('User not found.');
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized. Token invalid or expired.');
    }
});

// Check for blocked users
export const blockCheck = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isBlocked) {
        res.status(403);
        throw new Error('Your account has been blocked. Please contact support.');
    }
    next();
});

// Restrict to admin only
export const adminOnly = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Admins only.');
});

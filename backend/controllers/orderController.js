import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { items, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items provided.');
    }

    // Verify stock and build order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }
        if (product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images[0]?.url || '',
            price: product.price,
            quantity: item.quantity,
            unit: product.unit,
        });

        totalAmount += product.price * item.quantity;
        product.stock -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        totalAmount,
        address,
        paymentMethod,
        statusHistory: [{ status: 'Pending' }],
    });

    // Emit real-time alert to admin via Socket.io
    const io = req.app.get('io');
    if (io) {
        io.to('admin-room').emit('newOrder', {
            orderId: order._id,
            userName: req.user.name,
            totalAmount,
            createdAt: order.createdAt,
            items: orderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unit: item.unit
            }))
        });
    }

    res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name images');

    res.json({ success: true, orders });
});

// @desc    Get single order by ID (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name images');

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    // Only owner or admin can view
    if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        res.status(403);
        throw new Error('Not authorized to view this order.');
    }

    res.json({ success: true, order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') query.orderStatus = status;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59));
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('user', 'name email');

    res.json({ success: true, total, orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') order.paymentStatus = 'Paid';

    await order.save();
    res.json({ success: true, order });
});

// @desc    Cancel order (user)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized.');
    }

    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
        res.status(400);
        throw new Error('Order cannot be cancelled at this stage.');
    }

    // Restore stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.json({ success: true, order });
});

// @desc    Get dashboard stats (admin)
// @route   GET /api/orders/stats
// @access  Admin
import User from '../models/User.js';

export const getDashboardStats = asyncHandler(async (req, res) => {

    const [totalOrders, totalUsers, totalProducts, deliveredOrders] = await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: 'user' }),
        Product.countDocuments(),
        Order.find({ orderStatus: 'Delivered' }),
    ]);

    const totalSales = deliveredOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    // Monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlySales = await Order.aggregate([
        {
            $match: {
                orderStatus: 'Delivered',
                createdAt: { $gte: sixMonthsAgo },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                revenue: { $sum: '$totalAmount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
        success: true,
        stats: { totalOrders, totalUsers, totalProducts, totalSales },
        monthlySales,
    });
});

// @desc    Delete order (admin)
// @route   DELETE /api/orders/:id
// @access  Admin
export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    await order.deleteOne();
    res.json({ success: true, message: 'Order removed' });
});

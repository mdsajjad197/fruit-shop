import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all products with filter/search/pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const { category, search, page = 1, limit = 12, sort } = req.query;

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const sortObj = {};
    if (sort === 'price_asc') sortObj.price = 1;
    else if (sort === 'price_desc') sortObj.price = -1;
    else if (sort === 'newest') sortObj.createdAt = -1;
    else sortObj.createdAt = -1;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({
        success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        products,
    });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
        'ratings.user',
        'name avatar'
    );
    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }
    res.json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, category, price, stock, description, unit, isFeatured } = req.body;

    const images = req.files
        ? req.files.map((f) => ({ public_id: f.filename, url: f.path }))
        : [];

    const product = await Product.create({
        name,
        category,
        price: Number(price),
        stock: Number(stock),
        description,
        images,
        unit: unit || 'kg',
        isFeatured: isFeatured === 'true',
    });

    res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }

    const { name, category, price, stock, description, unit, isFeatured } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (description) product.description = description;
    if (unit) product.unit = unit;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';

    // Append new images if uploaded
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map((f) => ({ public_id: f.filename, url: f.path }));
        product.images = [...product.images, ...newImages];
    }

    const updated = await product.save();
    res.json({ success: true, product: updated });
});

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:public_id
// @access  Admin
export const deleteProductImage = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }

    await cloudinary.uploader.destroy(req.params.public_id);
    product.images = product.images.filter((img) => img.public_id !== req.params.public_id);
    await product.save();
    res.json({ success: true, images: product.images });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }

    // Delete all images from Cloudinary
    for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted.' });
});

// @desc    Add/update product rating
// @route   POST /api/products/:id/ratings
// @access  Private
export const rateProduct = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }

    const existingRating = product.ratings.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
        existingRating.rating = rating;
        existingRating.comment = comment || '';
    } else {
        product.ratings.push({ user: req.user._id, rating, comment: comment || '' });
    }

    await product.save();
    res.json({ success: true, ratings: product.ratings });
});

// @desc    Get low stock products (stock < 5)
// @route   GET /api/products/low-stock
// @access  Admin
export const getLowStockProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ stock: { $lt: 5 } }).sort({ stock: 1 });
    res.json({ success: true, products });
});

import express from 'express';
const router = express.Router();
import {
    getProducts,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    rateProduct,
    getLowStockProducts,
} from '../controllers/productController.js';
import { protect, blockCheck, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

// Public
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Private
router.post('/:id/ratings', protect, blockCheck, rateProduct);

// Admin
router.get('/admin/low-stock', protect, adminOnly, getLowStockProducts);
router.post(
    '/',
    protect,
    adminOnly,
    (req, res, next) => {
        upload.array('images', 6)(req, res, (err) => {
            if (err) {
                console.error('❌ Multer/Cloudinary Error:', err);
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    createProduct
);
router.put(
    '/:id',
    protect,
    adminOnly,
    (req, res, next) => {
        upload.array('images', 6)(req, res, (err) => {
            if (err) {
                console.error('❌ Multer/Cloudinary Error:', err);
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    updateProduct
);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/:id/images/:public_id', protect, adminOnly, deleteProductImage);

export default router;

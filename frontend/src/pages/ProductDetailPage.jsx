import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiArrowLeft, FiPackage, FiChevronLeft, FiChevronRight, FiHeart, FiShield, FiTruck, FiActivity } from 'react-icons/fi';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackSection from '../components/home/FeedbackSection';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [imgIdx, setImgIdx] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await productApi.getById(id);
                setProduct(data.product);
            } catch (_) { }
            setLoading(false);
        })();
    }, [id]);

    const handleRating = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to rate.');
        setSubmitting(true);
        try {
            await productApi.rate(id, { rating, comment });
            const { data } = await productApi.getById(id);
            setProduct(data.product);
            setComment('');
            toast.success('Review submitted!');
        } catch (err) {
            toast.error(err.message);
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div className="aspect-square bg-gray-50 rounded-[3rem] animate-pulse" />
                        <div className="space-y-8">
                            <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
                            <div className="h-16 w-3/4 bg-gray-100 rounded-2xl animate-pulse" />
                            <div className="h-24 w-full bg-gray-50 rounded-3xl animate-pulse" />
                            <div className="h-12 w-1/3 bg-gray-100 rounded-2xl animate-pulse" />
                            <div className="h-16 w-full bg-gray-100 rounded-3xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-sm"
                >
                    <div className="text-8xl mb-8 grayscale opacity-30">🍎🔍</div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Product not found</h2>
                    <p className="text-gray-400 font-bold mb-10">This product is no longer available. Please explore our other fresh products.</p>
                    <Link to="/products" className="inline-block bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                        Shop Now
                    </Link>
                </motion.div>
            </div>
        );
    }

    const images = product.images?.length > 0
        ? product.images
        : [{ url: 'https://res.cloudinary.com/dasxirndw/image/upload/v1703668800/caz-fruits/placeholder.png', public_id: 'ph' }];

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="container mx-auto px-4">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link to="/products" className="inline-flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary-500 transition-colors group">
                        <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to products
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
                    {/* Left: Immersive Gallery */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-[3rem] bg-[#f8fafc] overflow-hidden group shadow-2xl shadow-primary-500/5 border border-primary-50"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={imgIdx}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    src={images[imgIdx]?.url}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-12 drop-shadow-[0_45px_70px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-700"
                                />
                            </AnimatePresence>

                            {images.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                                        className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-all transform active:scale-90"
                                    >
                                        <FiChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                                        className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-all transform active:scale-90"
                                    >
                                        <FiChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {images.map((img, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setImgIdx(i)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-3xl bg-[#f8fafc] p-2 border-2 transition-all ${imgIdx === i ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-contain" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Premium Meta & Actions */}
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Category & Badge */}
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-2xl text-primary-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                                    <FiActivity size={12} /> {product.category}
                                </span>
                                {product.stock > 0 && (
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
                                    </span>
                                )}
                            </div>

                            {/* Title & Price */}
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">/{product.unit || 'kg'}</span>
                                    </div>
                                    <div className="h-10 w-[1px] bg-gray-100" />
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <FiStar
                                                key={s}
                                                size={16}
                                                className={s <= product.avgRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                                            />
                                        ))}
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">({product.ratings?.length || 0})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                                {product.description}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-50 group hover:border-primary-100 transition-colors">
                                    <FiShield className="text-primary-500 mb-4" size={24} />
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Quality Certified</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter leading-none">Pesticide Free</p>
                                </div>
                                <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-50 group hover:border-amber-100 transition-colors">
                                    <FiTruck className="text-amber-500 mb-4" size={24} />
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Same-Day Delivery</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter leading-none">Ultra Fresh</p>
                                </div>
                            </div>

                            {/* Actions Container */}
                            {product.stock > 0 && (
                                <div className="pt-8 space-y-6">
                                    <div className="flex items-center gap-4">
                                        {/* Qty Selector */}
                                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <button
                                                onClick={() => setQty(q => Math.max(0.5, q - 0.5))}
                                                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm hover:bg-gray-900 hover:text-white transition-all transform active:scale-90"
                                            >−</button>
                                            <span className="w-16 text-center font-black text-gray-900 text-lg tracking-tighter">{qty} kg</span>
                                            <button
                                                onClick={() => setQty(q => Math.min(product.stock, q + 0.5))}
                                                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm hover:bg-gray-900 hover:text-white transition-all transform active:scale-90"
                                            >+</button>
                                        </div>

                                        {/* Cart Button */}
                                        <button
                                            onClick={() => addToCart(product, qty)}
                                            className="flex-1 group relative h-[72px] bg-primary-500 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                <FiShoppingCart size={20} /> Add to Cart
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* General Feedback Section */}
                <div className="mt-16 border-t border-gray-100 pt-16">
                    <FeedbackSection />
                </div>
            </div>
        </div>
    );
}


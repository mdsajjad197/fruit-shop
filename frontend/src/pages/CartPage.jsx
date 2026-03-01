import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiActivity, FiTruck, FiShield } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-sm"
                >
                    <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full group-hover:bg-primary-500/30 transition-colors" />
                        <img
                            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop"
                            alt="Empty Basket"
                            className="relative w-64 h-64 object-cover rounded-[3rem] mx-auto shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700"
                        />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Your basket is empty</h2>
                    <p className="text-gray-400 font-bold mb-10">It looks like you haven't picked any fresh fruits yet. Let's explore the store!</p>
                    <Link to="/products" className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform group">
                        <FiShoppingBag size={18} /> Start Shopping <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    const deliveryCharge = cartTotal >= 500 ? 0 : 40;
    const grandTotal = cartTotal + deliveryCharge;

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="container mx-auto px-4">

                {/* Cart Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-2xl text-primary-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm mb-4">
                            <FiActivity size={12} /> Your Cart
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                            Shopping <span className="text-primary-500 italic">Cart</span>
                        </h1>
                    </motion.div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={clearCart}
                        className="inline-flex items-center gap-2 text-xs font-black text-gray-300 uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                        <FiTrash2 size={16} /> Clear all items
                    </motion.button>
                </div>

                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="space-y-6"
                        >
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                        className="group relative bg-[#f8fafc] p-6 md:p-8 rounded-[3rem] border border-gray-50 hover:border-primary-100 transition-all flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-primary-500/5"
                                    >
                                        {/* Image wrapper */}
                                        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2rem] p-4 flex-shrink-0 shadow-sm overflow-hidden border border-gray-50">
                                            <img
                                                src={item.images?.[0]?.url}
                                                alt={item.name}
                                                className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center md:text-left">
                                            <Link
                                                to={`/products/${item._id}`}
                                                className="text-2xl font-black text-gray-900 tracking-tight hover:text-primary-500 transition-colors block mb-2"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">₹{item.price} <span className="text-[10px] text-gray-300">/{item.unit || 'kg'}</span></p>
                                        </div>

                                        {/* Actions Wrapper */}
                                        <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                                            {/* Quantity Control */}
                                            <div className="flex items-center gap-2 p-1.5 bg-white rounded-full border border-gray-100 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 0.5)}
                                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all transform active:scale-90"
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="w-16 text-center font-black text-gray-900 tracking-tighter text-lg">{item.quantity} kg</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 0.5)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all transform active:scale-90 disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-900"
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>

                                            {/* Total and Trash */}
                                            <div className="flex items-center gap-6">
                                                <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all group/trash"
                                                >
                                                    <FiTrash2 size={18} className="group-hover/trash:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-32 p-10 bg-[#f8fafc] rounded-[3rem] border border-gray-50 shadow-2xl shadow-primary-500/5 space-y-10"
                        >
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Order <span className="text-primary-500 italic">Summary</span></h2>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal ({cartItems.length} items)</span>
                                    <span className="text-xl font-black text-gray-900 tracking-tighter">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Charge</span>
                                        {deliveryCharge === 0 ? (
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-tighter">Organic loyalty bonus</p>
                                        ) : (
                                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">Flat shipping</p>
                                        )}
                                    </div>
                                    <span className={`text-xl font-black tracking-tighter ${deliveryCharge === 0 ? 'text-primary-500' : 'text-gray-900'}`}>
                                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                    </span>
                                </div>

                                {cartTotal < 500 && (
                                    <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest leading-relaxed">
                                            Pick ₹{(500 - cartTotal).toFixed(2)} more for <span className="italic">FREE</span> delivery!
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Grand Total</span>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{grandTotal.toFixed(2)}</span>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Inclusive of GST</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10">
                                <Link
                                    to={user ? '/checkout' : '/login?redirect=/checkout'}
                                    className="group relative w-full h-[72px] bg-primary-500 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/20 overflow-hidden flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10 flex items-center gap-3">
                                        Proceed to Checkout <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link to="/products" className="w-full flex items-center justify-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors py-2">
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                                <div className="flex flex-col items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                                    <FiShield size={20} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Safe Payment</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                                    <FiTruck size={20} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Express Fast</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}


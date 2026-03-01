import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiCheck, FiPlus, FiArrowLeft, FiActivity, FiShield, FiTruck, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PAYMENT_METHODS = [
    { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Secure payment at your doorstep' },
    { value: 'UPI', label: 'Instant UPI', icon: '📱', desc: 'Pay via GPay, PhonePe, or Paytm' },
];

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [selectedAddr, setSelectedAddr] = useState(user?.addresses?.[0] || null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [placing, setPlacing] = useState(false);
    const [showAddrForm, setShowAddrForm] = useState(false);
    const [newAddr, setNewAddr] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '', phone: '' });

    const deliveryCharge = cartTotal >= 500 ? 0 : 40;
    const grandTotal = cartTotal + deliveryCharge;

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await authApi.addAddress(newAddr);
            updateUser({ ...user, addresses: data.addresses });
            setSelectedAddr(data.addresses[data.addresses.length - 1]);
            setShowAddrForm(false);
            setNewAddr({ label: 'Home', street: '', city: '', state: '', pincode: '', phone: '' });
            toast.success('New address added to your profile!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddr) return toast.error('Please select a delivery address.');
        if (cartItems.length === 0) return toast.error('Your cart is empty.');

        setPlacing(true);
        try {
            const { data } = await orderApi.createOrder({
                items: cartItems.map((i) => ({ product: i._id, quantity: i.quantity })),
                address: selectedAddr,
                paymentMethod,
            });
            clearCart();
            toast.success('Order placed successfully! 🎉');
            navigate(`/orders/${data.order._id}`);
        } catch (err) {
            toast.error(err.message);
        }
        setPlacing(false);
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link to="/cart" className="inline-flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary-500 transition-colors group mb-6">
                            <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to cart
                        </Link>
                        <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-2xl text-primary-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm mb-4 block w-fit">
                            <FiActivity size={12} /> Secure Checkout
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                            Checkout <span className="text-primary-500 italic">Details</span>
                        </h1>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Left: Forms */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* 1. Delivery Address Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-sm">01</span>
                                    Delivery Address
                                </h2>
                                <button
                                    onClick={() => setShowAddrForm(v => !v)}
                                    className="text-xs font-black text-primary-500 uppercase tracking-widest hover:text-primary-600 flex items-center gap-2 transition-colors"
                                >
                                    <FiPlus /> Add new address
                                </button>
                            </div>

                            <AnimatePresence>
                                {showAddrForm && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onSubmit={handleAddAddress}
                                        className="bg-[#f8fafc] p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-primary-500/5 space-y-6 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Address Label</label>
                                                <select value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))} className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer">
                                                    <option>Home</option><option>Work</option><option>Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                                                <input required value={newAddr.phone} onChange={e => setNewAddr(p => ({ ...p, phone: e.target.value }))} className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="+91 XXXXX XXXXX" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Street Address</label>
                                            <input required value={newAddr.street} onChange={e => setNewAddr(p => ({ ...p, street: e.target.value }))} className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="House no, Building, Street name" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">City</label>
                                                <input required value={newAddr.city} onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))} className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">State</label>
                                                <input required value={newAddr.state} onChange={e => setNewAddr(p => ({ ...p, state: e.target.value }))} className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Pincode</label>
                                                <input required value={newAddr.pincode} onChange={e => setNewAddr(p => ({ ...p, pincode: e.target.value }))} className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all" maxLength={6} />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button type="submit" className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/10 hover:scale-105 transition-transform">Save Address</button>
                                            <button type="button" onClick={() => setShowAddrForm(false)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Cancel</button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {/* Saved Addresses Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user?.addresses?.map((addr) => (
                                    <motion.button
                                        key={addr._id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedAddr(addr)}
                                        className={`text-left p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${selectedAddr?._id === addr._id
                                            ? 'border-primary-500 bg-[#f8fafc] shadow-2xl shadow-primary-500/5'
                                            : 'border-gray-50 hover:border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${selectedAddr?._id === addr._id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'
                                                }`}>{addr.label}</span>
                                            {selectedAddr?._id === addr._id && (
                                                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white">
                                                    <FiCheck size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-900 font-bold leading-relaxed mb-1">
                                            {addr.street}
                                        </p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                                            {addr.city}, {addr.state} — {addr.pincode}
                                        </p>
                                        <p className="text-xs text-primary-500 font-black tracking-widest mt-4 flex items-center gap-2">
                                            <FiShield size={12} /> {addr.phone}
                                        </p>
                                    </motion.button>
                                ))}
                                {(!user?.addresses || user.addresses.length === 0) && !showAddrForm && (
                                    <div className="md:col-span-2 p-12 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 text-center">
                                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No delivery address selected. Add a new address above.</p>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        <hr className="border-gray-100" />

                        {/* 2. Payment Method Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                                <span className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-sm">02</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {PAYMENT_METHODS.map((m) => (
                                    <motion.button
                                        key={m.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod(m.value)}
                                        className={`text-left p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${paymentMethod === m.value
                                            ? 'border-primary-500 bg-[#f8fafc] shadow-2xl shadow-primary-500/5'
                                            : 'border-gray-50 hover:border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-4xl">{m.icon}</span>
                                            {paymentMethod === m.value && (
                                                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white">
                                                    <FiCheck size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-lg font-black text-gray-900 tracking-tight mb-1">{m.label}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{m.desc}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-32 p-10 bg-gray-900 rounded-[3rem] text-white shadow-2xl space-y-10"
                        >
                            <h2 className="text-3xl font-black tracking-tighter">Order <span className="text-primary-500 italic">Summary</span></h2>

                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex justify-between items-start border-b border-white/5 pb-4">
                                        <div className="max-w-[180px]">
                                            <p className="text-sm font-black tracking-tight truncate">{item.name}</p>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-black tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                    <span>Delivery</span>
                                    <span className={deliveryCharge === 0 ? 'text-primary-500' : 'text-white'}>
                                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                    </span>
                                </div>
                                <div className="pt-6 flex justify-between items-end border-t border-white/5">
                                    <span className="text-sm font-black uppercase tracking-[0.2em]">Total</span>
                                    <div className="text-right">
                                        <span className="text-4xl font-black tracking-tighter text-primary-500">₹{grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing || !selectedAddr}
                                className="group relative w-full h-[72px] bg-primary-500 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/20 overflow-hidden flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-30 disabled:grayscale"
                            >
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <span className="relative z-10 flex items-center gap-3 group-hover:text-primary-600 transition-colors">
                                    {placing ? 'Processing...' : `Confirm Order`} <FiChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            {/* Trust badges */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex flex-col items-center gap-2 opacity-30">
                                    <FiShield size={16} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 opacity-30">
                                    <FiTruck size={16} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Fresh Log</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}


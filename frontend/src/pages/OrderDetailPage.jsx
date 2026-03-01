import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiPackage, FiTruck, FiMapPin, FiCreditCard, FiShield, FiClock } from 'react-icons/fi';
import { orderApi } from '../api/orderApi';
import OrderStatusBadge from '../components/OrderStatusBadge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered'];

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await orderApi.getOrderById(id);
                setOrder(data.order);
            } catch (_) { }
            setLoading(false);
        })();
    }, [id]);

    const handleCancel = async () => {
        if (!window.confirm('Erase this order trajectory?')) return;
        setCancelling(true);
        try {
            const { data } = await orderApi.cancelOrder(id);
            setOrder(data.order);
            toast.success('Order Cancelled');
        } catch (err) {
            toast.error(err.message);
        }
        setCancelling(false);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
                <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="h-[500px] bg-gray-50 rounded-[3rem] animate-pulse" />
                    <div className="h-[500px] bg-gray-50 rounded-[3rem] animate-pulse" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-32 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6">
                    <FiPackage size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Order <span className="text-primary-500 italic">Not Found.</span></h2>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">No order matching this ID was found</p>
                <Link to="/orders" className="mt-8 inline-flex px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-2xl">Return to Orders</Link>
            </div>
        );
    }

    const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);
    const isCancelled = order.orderStatus === 'Cancelled';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-20"
        >
            {/* Utility Bar */}
            <div className="flex items-center justify-between mb-12">
                <Link to="/orders" className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary-500 transition-colors group">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                        <FiArrowLeft size={14} />
                    </div>
                    Back to Orders
                </Link>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                            <FiPackage size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Order Details</span>
                    </div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">
                        #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                        <FiClock className="text-primary-500" /> Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <OrderStatusBadge status={order.orderStatus} />
                    {['Pending', 'Confirmed'].includes(order.orderStatus) && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="px-8 py-5 bg-red-500/5 text-red-500 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5 disabled:opacity-50"
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    {/* Itemized Manifest */}
                    <div className="bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
                        <h2 className="text-2xl font-black text-gray-900 mb-10 tracking-tighter flex items-center gap-4">
                            <FiPackage size={24} className="text-primary-500" /> Order <span className="text-primary-500">Items.</span>
                        </h2>
                        <div className="space-y-8">
                            {order.items.map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="flex items-center gap-8 group"
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <img
                                            src={item.image || 'https://placehold.co/200x200/e8f5e9/22c55e?text=🍎'}
                                            alt={item.name}
                                            className="relative w-24 h-24 object-cover rounded-2xl shadow-xl shadow-black/5"
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-black text-gray-900 tracking-tighter truncate">{item.name}</p>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            <span>Qty: {item.quantity} {item.unit}</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                            <span>Price: ₹{item.price}</span>
                                        </div>
                                    </div>
                                    <p className="text-xl font-black text-gray-900 tracking-tight">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 pt-10 border-t-2 border-dashed border-gray-50 flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Amount</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Logistics Tracking */}
                    {!isCancelled && (
                        <div className="bg-[#121212] p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                            <h2 className="text-2xl font-black text-white mb-16 tracking-tighter flex items-center gap-4">
                                <FiTruck size={24} className="text-primary-500" /> Order <span className="text-primary-500">Status.</span>
                            </h2>
                            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-4 relative">
                                {STATUS_STEPS.map((step, i) => (
                                    <div key={step} className="flex-1 flex flex-col md:flex-row items-center w-full relative z-10">
                                        <div className="flex flex-col items-center flex-shrink-0 group">
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    scale: i === currentStepIdx ? 1.2 : 1,
                                                    boxShadow: i <= currentStepIdx ? '0 0 30px rgba(34,197,94,0.3)' : 'none'
                                                }}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${i < currentStepIdx ? 'bg-primary-500 text-white' :
                                                    i === currentStepIdx ? 'bg-primary-500 text-white shadow-xl' :
                                                        'bg-white/5 text-white/20'
                                                    }`}
                                            >
                                                {i < currentStepIdx ? <FiCheck size={24} /> : i + 1}
                                            </motion.div>
                                            <span className={`text-[9px] mt-4 font-black uppercase tracking-widest text-center whitespace-nowrap transition-colors ${i <= currentStepIdx ? 'text-primary-500' : 'text-white/20'
                                                }`}>
                                                {step}
                                            </span>
                                        </div>
                                        {i < STATUS_STEPS.length - 1 && (
                                            <div className="hidden md:block flex-1 h-1 mx-4 rounded-full relative bg-white/10">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: i < currentStepIdx ? '100%' : '0%' }}
                                                    className="absolute inset-0 bg-primary-500 rounded-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isCancelled && (
                        <div className="bg-red-500/5 p-12 rounded-[3.5rem] border-2 border-red-500/20 text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                <FiX size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-red-500 tracking-tighter">Order Cancelled</h3>
                            <p className="text-[10px] font-black text-red-400/60 uppercase tracking-widest mt-2">This order has been successfully cancelled.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Destination Vault */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
                        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tighter">
                            <FiMapPin className="text-primary-500" /> Delivery <span className="text-primary-500">Address.</span>
                        </h2>
                        <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-100 mb-6 inline-block">
                            {order.address?.label} Address
                        </span>
                        <div className="space-y-4">
                            <p className="text-lg font-black text-gray-900 tracking-tight leading-tight">{order.address?.street}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <FiMapPin className="shrink-0" /> {order.address?.city}, {order.address?.state} — {order.address?.pincode}
                            </p>
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 pt-4">
                                <div className="w-6 h-6 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                                    <FiTruck size={10} />
                                </div>
                                {order.address?.phone}
                            </p>
                        </div>
                    </div>

                    {/* Settlement Config */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
                        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tighter">
                            <FiCreditCard className="text-primary-500" /> Payment <span className="text-primary-500">Details.</span>
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors">Payment Method</span>
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center group pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors">Payment Status</span>
                                <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${order.paymentStatus === 'Paid'
                                    ? 'bg-primary-500/10 border-primary-500/20 text-primary-500'
                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Security Certificate */}
                    <div className="bg-primary-500/5 p-8 rounded-[2.5rem] border border-primary-500/10 flex items-center gap-4">
                        <FiShield className="text-primary-500 shrink-0" size={20} />
                        <p className="text-[9px] font-black text-primary-900 opacity-60 uppercase tracking-widest leading-relaxed">
                            This transaction is digitally authenticated and protected by our end-to-end logistics encryption.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}


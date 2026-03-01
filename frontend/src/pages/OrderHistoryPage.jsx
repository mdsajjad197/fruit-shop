import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight, FiCalendar, FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import { orderApi } from '../api/orderApi';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { motion } from 'framer-motion';

const CONTAINER_VARS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const ITEM_VARS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } }
};

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await orderApi.getMyOrders();
                setOrders(data.orders);
            } catch (_) { }
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-20 space-y-6">
                <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 w-full bg-gray-50 rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200">
                        <FiShoppingBag size={48} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">No Orders <span className="text-primary-500 italic">Yet.</span></h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Start shopping by placing your first order</p>
                    </div>
                    <Link to="/products" className="mt-4 px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-2xl">Shop Now</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={CONTAINER_VARS}
            className="max-w-5xl mx-auto px-6 py-20"
        >
            <div className="mb-16">
                <motion.div variants={ITEM_VARS} className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                        <FiPackage size={16} />
                    </div>
                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Your Orders</span>
                </motion.div>
                <motion.h1 variants={ITEM_VARS} className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Order <span className="text-primary-500 italic">History.</span></motion.h1>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <motion.div key={order._id} variants={ITEM_VARS}>
                        <Link
                            to={`/orders/${order._id}`}
                            className="bg-white border border-gray-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all relative overflow-hidden"
                        >
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors">
                                    <FiPackage size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</span>
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Online Order</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <FiCalendar size={12} />
                                            <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FiShoppingBag size={12} />
                                            <span>{order.items?.length} Items</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-10 relative z-10">
                                <OrderStatusBadge status={order.orderStatus} />
                                <div className="text-right">
                                    <p className="text-xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                                    <div className="flex items-center justify-end gap-1.5 text-[9px] font-black text-primary-500 uppercase tracking-widest mt-1">
                                        <span>Details</span>
                                        <FiArrowRight />
                                    </div>
                                </div>
                            </div>

                            {/* Subtle Glow Background Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}


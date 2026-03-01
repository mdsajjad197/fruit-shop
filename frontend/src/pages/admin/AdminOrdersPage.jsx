import { useEffect, useState, useCallback } from 'react';
import { orderApi } from '../../api/orderApi';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCalendar, FiFilter, FiSearch, FiArrowRight, FiUser, FiCreditCard, FiTrash2 } from 'react-icons/fi';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: 50 };
            if (filter !== 'All') params.status = filter;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            const { data } = await orderApi.getAllOrders(params);
            setOrders(data.orders);
        } catch (_) { }
        setLoading(false);
    }, [filter, startDate, endDate]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await orderApi.updateStatus(orderId, newStatus);
            toast.success('Order status updated!');
            fetchOrders();
        } catch (err) {
            toast.error(err.message);
        }
        setUpdatingId(null);
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        setUpdatingId(orderId);
        try {
            await orderApi.deleteOrder(orderId);
            toast.success('Order deleted successfully!');
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
        setUpdatingId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                            <FiShoppingCart size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Operational Manifest</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Order <span className="text-primary-500 italic">Tracking.</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Real-time fulfillment and logistics management</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-200">
                        {['All', 'Pending', 'Delivered'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-xl">
                <div className="lg:col-span-2 flex flex-wrap gap-2">
                    {STATUSES.filter(s => !['All', 'Pending', 'Delivered'].includes(s)).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${filter === s ? 'bg-primary-500/10 border-primary-500/20 text-primary-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900'}`}
                        >
                            {s}
                        </button>
                    ))}
                    {filter !== 'All' && !STATUSES.includes(filter) && (
                        <button onClick={() => setFilter('All')} className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-2 hover:text-gray-900">Reset All</button>
                    )}
                </div>
                <div className="flex items-center gap-4 lg:col-span-2">
                    <div className="relative flex-1">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-primary-500/20 focus:bg-white" />
                    </div>
                    <FiArrowRight className="text-gray-700 shrink-0" />
                    <div className="relative flex-1">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-primary-500/20 focus:bg-white" />
                    </div>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-[3rem] border border-gray-200 overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-10 space-y-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse border border-gray-200" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Order Reference</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Client Profile</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Timeline</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Settlement</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] text-right">Update Protocol</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode='popLayout'>
                                    {orders.map((order, idx) => (
                                        <motion.tr
                                            key={order._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-black text-gray-900 font-mono uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</span>
                                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Autonomous ID</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <FiUser size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900">{order.user?.name}</p>
                                                        <p className="text-[9px] font-black text-gray-600 uppercase mt-0.5">{order.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-black text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                <p className="text-[9px] font-black text-gray-600 uppercase mt-0.5">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm font-black text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                                        <FiCreditCard size={10} />
                                                        <span>{order.paymentMethod}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <OrderStatusBadge status={order.orderStatus} />
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end">
                                                    <div className="relative group/select">
                                                        <select
                                                            disabled={updatingId === order._id || order.orderStatus === 'Cancelled'}
                                                            value={order.orderStatus}
                                                            onChange={e => handleStatusUpdate(order._id, e.target.value)}
                                                            className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-6 pr-12 text-[10px] font-black text-gray-900 uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group-hover/select:bg-white"
                                                        >
                                                            {STATUSES.filter(s => s !== 'All').map(s => (
                                                                <option key={s} value={s} className="bg-white">{s}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none group-hover/select:text-gray-900 transition-colors">
                                                            <FiArrowRight size={14} className="rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    disabled={updatingId === order._id}
                                                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete Order"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <FiShoppingCart size={32} />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Operational silence - No orders matching criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { FiMessageSquare, FiStar, FiCheck, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { feedbackApi } from '../../api/feedbackApi';

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const data = await feedbackApi.getFeedbackAdmin();
                setFeedback(data.feedbackList);
            } catch (error) {
                toast.error('Failed to load feedback');
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    useEffect(() => {
        // Socket connection to listen for realtime feedback
        const socket = import.meta.env.VITE_SOCKET_URL
            ? io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true })
            : io('http://localhost:5000', { withCredentials: true });

        socket.emit('join-admin');

        socket.on('newFeedback', (data) => {
            setFeedback((prev) => [data, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await feedbackApi.markFeedbackReadAdmin(id);
            setFeedback(feedback.map(f => f._id === id ? { ...f, isRead: true } : f));
            toast.success('Feedback marked as read');
        } catch (error) {
            toast.error('Failed to update feedback');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this feedback permanently?')) {
            try {
                await feedbackApi.deleteFeedbackAdmin(id);
                setFeedback(feedback.filter(f => f._id !== id));
                toast.success('Feedback removed');
            } catch (error) {
                toast.error('Failed to delete feedback');
            }
        }
    };

    const filtered = feedback.filter(f => {
        if (filter === 'Unread') return !f.isRead;
        if (filter === 'Read') return f.isRead;
        return true;
    });

    const averageRating = feedback.length > 0
        ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)
        : 0;

    return (
        <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
            {/* Header section matches new Light & Fresh Admin Theme */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-10 rounded-[3rem] border border-gray-200 shadow-xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <FiMessageSquare size={24} />
                        </div>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Customer Voice</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Feedback <span className="text-amber-500 italic">Log.</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Monitor and respond to user experiences</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-200">
                        {['All', 'Unread', 'Read'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-200 flex flex-col items-center">
                        <div className="flex items-center gap-2 text-amber-500">
                            <FiStar className="fill-current" size={16} />
                            <span className="text-xl font-black text-gray-900 leading-none">{averageRating}</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">Average</span>
                    </div>
                </div>
            </div>

            {/* Feedback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white h-64 rounded-[2.5rem] border border-gray-200 animate-pulse" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="col-span-full bg-white p-20 rounded-[3rem] border border-gray-200 shadow-xl flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-6">
                            <FiSearch size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Feedback Found</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Everything is completely silent right now.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group bg-white rounded-[2.5rem] border ${item.isRead ? 'border-gray-200 opacity-80' : 'border-amber-200 shadow-lg shadow-amber-500/5'} p-8 relative flex flex-col h-full transition-all hover:shadow-xl`}
                            >
                                {!item.isRead && (
                                    <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                )}

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={i < item.rating ? 'fill-current' : 'text-gray-200'} size={14} />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="text-sm font-bold text-gray-700 leading-relaxed mb-8 flex-1">"{item.message}"</p>

                                <div className="flex items-end justify-between mt-auto pt-6 border-t border-gray-100">
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-gray-900 truncate">{item.user?.name || 'Anonymous'}</p>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 truncate">{item.user?.email}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        {!item.isRead && (
                                            <button
                                                onClick={() => handleMarkRead(item._id)}
                                                className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                                title="Mark as Read"
                                            >
                                                <FiCheck size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Delete Feedback"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

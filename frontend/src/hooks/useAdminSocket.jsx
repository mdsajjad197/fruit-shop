import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { FiPackage, FiStar } from 'react-icons/fi';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useAdminSocket() {
    const socketRef = useRef(null);
    const [newOrderCount, setNewOrderCount] = useState(0);
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('adminNotifications');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        const socket = io(SOCKET_URL, { withCredentials: true });
        socketRef.current = socket;

        socket.emit('join-admin');

        socket.on('newOrder', (data) => {
            setNewOrderCount((prev) => prev + 1);

            setNotifications((prev) => [{
                id: Date.now(),
                type: 'new_order',
                data,
                read: false,
                timestamp: new Date().toISOString()
            }, ...prev].slice(0, 50)); // Keep last 50 notifications

            // Toast notification
            toast.custom(
                (t) => (
                    <div
                        className={`${t.visible ? 'animate-slide-up' : 'opacity-0'} bg-white border border-gray-200 px-6 py-5 rounded-3xl shadow-2xl flex items-start gap-4 w-[360px] pointer-events-auto transition-all`}
                    >
                        <div className="bg-primary-50 text-primary-600 p-3 rounded-2xl flex-shrink-0">
                            <FiPackage size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 text-sm tracking-tight mb-0.5">Order Received <span className="text-primary-500">🎉</span></p>
                            <p className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-3 drop-shadow-sm">
                                <span className="text-gray-900">{data.userName}</span> • ₹{data.totalAmount?.toLocaleString()}
                            </p>

                            {data.items && data.items.length > 0 && (
                                <div className="space-y-1.5 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                    {data.items.slice(0, 2).map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-gray-700 truncate pr-2">{item.name}</span>
                                            <span className="font-black text-gray-900 shrink-0">{item.quantity} {item.unit}</span>
                                        </div>
                                    ))}
                                    {data.items.length > 2 && (
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest pt-1 border-t border-gray-200 mt-2">+{data.items.length - 2} more items</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ),
                { duration: 8000 }
            );

            // Play notification sound
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, ctx.currentTime);
                oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.4);
            } catch (_) { }
        });

        socket.on('newFeedback', (data) => {
            setNotifications((prev) => [{
                id: Date.now(),
                type: 'new_feedback',
                data,
                read: false,
                timestamp: new Date().toISOString()
            }, ...prev].slice(0, 50));

            // Toast notification
            toast.custom(
                (t) => (
                    <div
                        className={`${t.visible ? 'animate-slide-up' : 'opacity-0'} bg-white border border-gray-200 px-6 py-5 rounded-3xl shadow-2xl flex items-start gap-4 w-[360px] pointer-events-auto transition-all`}
                    >
                        <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl flex-shrink-0">
                            <FiStar className="fill-current" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 text-sm tracking-tight mb-0.5">New Feedback <span className="text-amber-500">🌟</span></p>
                            <p className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-3 drop-shadow-sm">
                                <span className="text-gray-900">{data.user?.name || 'Anonymous'}</span> • {data.rating}/5 Stars
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                <p className="text-xs font-bold text-gray-700 italic">"{data.message}"</p>
                            </div>
                        </div>
                    </div>
                ),
                { duration: 8000 }
            );

            // Play notification sound
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, ctx.currentTime);
                oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.4);
            } catch (_) { }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const clearCount = () => setNewOrderCount(0);
    const clearNotifications = () => setNotifications([]);
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    return { newOrderCount, clearCount, notifications, clearNotifications, markAllRead };
}

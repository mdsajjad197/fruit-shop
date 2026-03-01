const STATUS_CONFIG = {
    Pending: {
        bg: 'bg-white/5 border-white/5 text-gray-400',
        dot: 'bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.5)]'
    },
    Confirmed: {
        bg: 'bg-blue-500/10 border-blue-500/10 text-blue-400',
        dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
    },
    'Out for Delivery': {
        bg: 'bg-amber-500/10 border-amber-500/10 text-amber-500',
        dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    },
    Delivered: {
        bg: 'bg-primary-500/10 border-primary-500/10 text-primary-500',
        dot: 'bg-primary-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
    },
    Cancelled: {
        bg: 'bg-red-500/10 border-red-500/10 text-red-400',
        dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
    },
};

export default function OrderStatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${cfg.bg} flex items-center gap-2 w-fit`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {status}
        </span>
    );
}


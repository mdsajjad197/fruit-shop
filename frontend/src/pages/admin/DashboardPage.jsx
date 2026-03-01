import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign, FiAlertTriangle, FiTrendingUp, FiActivity, FiZap, FiTarget } from 'react-icons/fi';
import { orderApi } from '../../api/orderApi';
import { productApi } from '../../api/productApi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function AnimatedNumber({ value, prefix = '' }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseFloat(value);
        if (start === end || isNaN(end)) {
            setDisplayValue(end || 0);
            return;
        }

        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * end);

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{prefix}{displayValue.toLocaleString()}</span>;
}

const CONTAINER_VARS = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const ITEM_VARS = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

function StatCard({ icon: Icon, label, value, colorClass, bgGradient, suffix = '' }) {
    return (
        <motion.div
            variants={ITEM_VARS}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-white border border-gray-200 p-8 rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500"
        >
            <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity ${bgGradient}`} />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${bgGradient} flex items-center justify-center text-white shadow-2xl`}>
                    <Icon size={24} />
                </div>
                <div className="flex items-center gap-1.5 bg-primary-500/10 px-3 py-1.5 rounded-xl">
                    <FiTrendingUp className="text-primary-500" size={12} />
                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">+12.5%</span>
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{label}</p>
                <h3 className={`text-4xl font-black tracking-tighter text-gray-900`}>
                    <AnimatedNumber value={value} prefix={suffix === '₹' ? '₹' : ''} />
                    {suffix !== '₹' && suffix}
                </h3>
            </div>
        </motion.div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [monthlySales, setMonthlySales] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [statsRes, lowStockRes] = await Promise.all([
                    orderApi.getDashboardStats(),
                    productApi.getLowStock(),
                ]);
                setStats(statsRes.data.stats);
                setMonthlySales(statsRes.data.monthlySales);
                setLowStock(lowStockRes.data.products);
            } catch (_) { }
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-100 h-56 rounded-[2.5rem] border border-gray-200" />
                ))}
                <div className="lg:col-span-4 bg-gray-100 h-[500px] rounded-[3.5rem] border border-gray-200" />
            </div>
        );
    }

    const chartLabels = monthlySales.map(m => MONTHS[m._id.month - 1]);
    const chartData = monthlySales.map(m => m.revenue);

    const lineData = {
        labels: chartLabels,
        datasets: [{
            label: 'Trajectory',
            data: chartData,
            borderColor: '#2ebd59',
            backgroundColor: (context) => {
                const bg = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                bg.addColorStop(0, 'rgba(46, 189, 89, 0.2)');
                bg.addColorStop(1, 'rgba(46, 189, 89, 0)');
                return bg;
            },
            tension: 0.5,
            fill: true,
            pointBackgroundColor: '#2ebd59',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 4,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 6,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { bottom: 10 } },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#111827',
                bodyColor: '#111827',
                titleFont: { size: 12, weight: '900', family: 'Inter' },
                bodyFont: { size: 14, weight: '700', family: 'Inter' },
                padding: 16,
                cornerRadius: 16,
                displayColors: false,
                borderColor: '#e5e7eb',
                borderWidth: 1,
                callbacks: { label: (ctx) => `Revenue: ₹${ctx.parsed.y.toLocaleString()}` }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#4b5563', font: { weight: '800', size: 10, family: 'Inter' } }
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                ticks: {
                    color: '#4b5563',
                    font: { weight: '800', size: 10, family: 'Inter' },
                    callback: (v) => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`
                }
            },
        },
    };

    return (
        <motion.div
            variants={CONTAINER_VARS}
            initial="hidden"
            animate="show"
            className="space-y-12"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div variants={ITEM_VARS}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                            <FiActivity size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Live Feed Analytics</span>
                    </div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">Admin <span className="text-primary-500">Panel.</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Autonomous shop management protocol initialized</p>
                </motion.div>

            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    icon={FiDollarSign}
                    label="Gross Revenue"
                    value={stats?.totalSales || 0}
                    bgGradient="bg-primary-500"
                    suffix="₹"
                />
                <StatCard
                    icon={FiShoppingBag}
                    label="Sales Volume"
                    value={stats?.totalOrders || 0}
                    bgGradient="bg-amber-500"
                />
                <StatCard
                    icon={FiUsers}
                    label="Harvester Base"
                    value={stats?.totalUsers || 0}
                    bgGradient="bg-blue-500"
                />
                <StatCard
                    icon={FiPackage}
                    label="Inventory Units"
                    value={stats?.totalProducts || 0}
                    bgGradient="bg-purple-500"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Visual Trajectory Chart */}
                <motion.div
                    variants={ITEM_VARS}
                    className="lg:col-span-2 bg-white rounded-[3.5rem] border border-gray-200 p-10 relative overflow-hidden shadow-xl"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                                <FiZap size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Revenue Trajectory</h2>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Growth audit / Fiscal Year '24</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />)}
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        {chartLabels.length > 0 ? (
                            <Line data={lineData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-700 font-black uppercase text-[10px] tracking-widest">No sensor data received</div>
                        )}
                    </div>
                </motion.div>

                {/* Stock Audit & Heat Map */}
                <motion.div variants={ITEM_VARS} className="space-y-8">
                    <div className="bg-white rounded-[3.5rem] border border-gray-200 p-10 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/10">
                                <FiAlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 leading-none">Stock Breach</h2>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1.5">Critical Inventory Alerts</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {lowStock.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="text-4xl mb-4 grayscale opacity-20">🍃</div>
                                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Inventory Fully Replenished</p>
                                </div>
                            )}
                            {lowStock.slice(0, 4).map((p) => (
                                <motion.div
                                    whileHover={{ x: 8 }}
                                    key={p._id}
                                    className="flex items-center justify-between bg-gray-50 rounded-2xl p-5 border border-gray-200 group/item cursor-pointer"
                                >
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-gray-900 truncate">{p.name}</p>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mt-1">{p.category}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${p.stock === 0 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/10'}`}>
                                            {p.stock === 0 ? 'Deficit' : `${p.stock} Left`}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {lowStock.length > 4 && (
                            <button className="w-full mt-8 py-5 rounded-2xl bg-gray-100 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:bg-gray-200 hover:text-gray-900 transition-all">Process All Breaches</button>
                        )}
                    </div>

                    {/* Operational Targets */}
                    <div className="bg-white rounded-[3.5rem] border border-gray-200 p-10 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <FiTarget size={24} />
                            </div>
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Q4 Protocols</h2>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Harvest Target', progress: '85%', color: 'bg-primary-500' },
                                { label: 'Logistics Efficiency', progress: '62%', color: 'bg-blue-500' },
                                { label: 'Safety Compliance', progress: '100%', color: 'bg-emerald-500' }
                            ].map((target, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <span>{target.label}</span>
                                        <span className="text-gray-900">{target.progress}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: target.progress }}
                                            transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
                                            className={`h-full ${target.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}



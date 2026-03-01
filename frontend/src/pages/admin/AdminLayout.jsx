import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut,
    FiMenu, FiX, FiBell, FiChevronRight, FiActivity, FiShield, FiSearch, FiMessageSquare
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useAdminSocket } from '../../hooks/useAdminSocket';

const NAV = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: FiPackage, label: 'Inventory-mangement' },
    { to: '/admin/orders', icon: FiShoppingBag, label: 'Order' },
    { to: '/admin/users', icon: FiUsers, label: 'User' },
    { to: '/admin/feedback', icon: FiMessageSquare, label: 'Feedback' },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { newOrderCount, clearCount } = useAdminSocket();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-600 font-sans flex overflow-hidden selection:bg-primary-500/30">

            {/* Dark Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-700 ease-[0.16, 1, 0.3, 1] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:static lg:translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.05)]`}
            >
                {/* Brand Logo Section */}
                <div className="p-10">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 bg-primary-500 rounded-[1.2rem] flex items-center justify-center text-2xl shadow-2xl shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                            🌿
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Caz <span className="text-primary-500 italic">Admin</span></h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Harvest Protocol</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar pt-4">
                    <p className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
                    {NAV.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `group flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-500 ${isActive
                                    ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                        >
                            <div className="flex items-center gap-4">
                                <Icon size={18} className="transition-transform group-hover:scale-110" />
                                <span>{label}</span>
                            </div>
                            <FiChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </NavLink>
                    ))}
                </nav>

                {/* Secondary Actions / Profile */}
                <div className="p-8">
                    <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-200 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 flex items-center justify-center font-black text-primary-700 text-lg shadow-sm">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-[10px] text-primary-500 font-black uppercase tracking-widest">Master Key</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all duration-500 group/logout"
                            >
                                <FiLogOut size={14} className="group-hover/logout:-translate-x-1 transition-transform" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Main Viewport Container */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">

                {/* Global Admin Header */}
                <header className="h-24 flex items-center justify-between px-10 border-b border-gray-200 bg-white/80 backdrop-blur-2xl sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-4 bg-gray-50 border border-gray-200 rounded-2xl lg:hidden text-gray-600 hover:text-gray-900 transition-all active:scale-90"
                        >
                            <FiMenu size={22} />
                        </button>
                        <div className="hidden lg:block relative group">
                            <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Command..."
                                className="bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-80 transition-all placeholder:text-gray-400 focus:w-96 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearCount}
                            className="relative w-14 h-14 bg-gray-50 border border-gray-200 rounded-[1.2rem] flex items-center justify-center text-gray-600 hover:text-primary-500 hover:bg-primary-50 hover:border-primary-100 transition-all group"
                        >
                            <FiBell size={22} className="group-hover:rotate-12 transition-transform" />
                            {newOrderCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-black rounded-lg h-6 min-w-[24px] px-2 flex items-center justify-center border-4 border-white shadow-lg shadow-primary-500/20">
                                    {newOrderCount}
                                </span>
                            )}
                        </motion.button>

                        <div className="h-8 w-px bg-gray-200" />

                        {/* System Badge */}
                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 pl-2 pr-5 py-2 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                                <FiShield size={18} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scroll Area */}
                <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}




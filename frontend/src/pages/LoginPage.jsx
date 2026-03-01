import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(form.email, form.password);
            navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
            toast.success(`Welcome back, ${data.user.username}! 🍎`);
        } catch (err) {
            toast.error(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-20 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-50 rounded-full blur-[100px] opacity-50" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-50 rounded-full blur-[100px] opacity-50" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg relative"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-2xl text-primary-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm mb-6"
                    >
                        <FiActivity size={12} /> Member Portal
                    </motion.div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                        Welcome <span className="text-primary-500 italic">Back.</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Sign in to your organic harvest account</p>
                </div>

                <div className="bg-[#f8fafc]/80 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white shadow-2xl shadow-primary-500/5 relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Email Address</label>
                            <div className="relative group">
                                <FiMail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    className="w-full bg-white border-2 border-transparent rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-gray-900 shadow-sm focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        alert("isnot recovery your old account please kindly create a new account continue shopping");
                                        navigate('/register');
                                    }}
                                    className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative group">
                                <FiLock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    required
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    className="w-full bg-white border-2 border-transparent rounded-3xl py-5 pl-14 pr-14 text-sm font-bold text-gray-900 shadow-sm focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                                >
                                    {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full h-[72px] bg-gray-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl overflow-hidden flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center gap-3">
                                {loading ? 'Checking...' : 'Sign In'} <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-gray-50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            New harvester?{' '}
                            <Link to="/register" className="text-primary-500 hover:text-gray-900 transition-colors decoration-2 underline-offset-4">
                                Join the garden
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom decorative fruit */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-10 -right-10 text-6xl select-none pointer-events-none opacity-20 grayscale"
                >
                    🍋
                </motion.div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -left-10 text-6xl select-none pointer-events-none opacity-20 grayscale"
                >
                    🌿
                </motion.div>
            </motion.div>
        </div>
    );
}


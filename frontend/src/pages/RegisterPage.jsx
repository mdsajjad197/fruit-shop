import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) return toast.error('Passwords do not match.');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success(`Welcome to the garden, ${form.name.split(' ')[0]}! 🌿`);
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        }
        setLoading(false);
    };

    const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-20 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary-50 rounded-full blur-[100px] opacity-50" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-amber-50 rounded-full blur-[100px] opacity-50" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl relative"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-2xl text-primary-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm mb-6"
                    >
                        <FiActivity size={12} /> New Membership
                    </motion.div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                        Join the <span className="text-primary-500 italic">Garden.</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Create your organic harvest account</p>
                </div>

                <div className="bg-[#f8fafc]/80 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white shadow-2xl shadow-primary-500/5 relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Full Name</label>
                                <div className="relative group">
                                    <FiUser size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={set('name')}
                                        className="w-full bg-white border-2 border-transparent rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 shadow-sm focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Email Address</label>
                                <div className="relative group">
                                    <FiMail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={set('email')}
                                        className="w-full bg-white border-2 border-transparent rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 shadow-sm focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Password</label>
                                <div className="relative group">
                                    <FiLock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        required
                                        value={form.password}
                                        onChange={set('password')}
                                        className="w-full bg-white border-2 border-transparent rounded-3xl py-4 pl-14 pr-14 text-sm font-bold text-gray-900 shadow-sm focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
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
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Confirm</label>
                                <div className="relative group">
                                    <FiLock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={form.confirm}
                                        onChange={set('confirm')}
                                        className="w-full bg-white border-2 border-transparent rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 shadow-sm focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full h-[72px] bg-gray-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl overflow-hidden flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center gap-3">
                                {loading ? 'Creating...' : 'Launch Account'} <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-gray-50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            Already a member?{' '}
                            <Link to="/login" className="text-primary-500 hover:text-gray-900 transition-colors decoration-2 underline-offset-4">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom decorative fruit */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-10 -left-10 text-6xl select-none pointer-events-none opacity-20 grayscale"
                >
                    🍎
                </motion.div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -right-10 text-6xl select-none pointer-events-none opacity-20 grayscale"
                >
                    🍇
                </motion.div>
            </motion.div>
        </div>
    );
}


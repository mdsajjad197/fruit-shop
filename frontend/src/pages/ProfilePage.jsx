import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { FiUser, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiShield, FiMail, FiLock, FiSmartphone, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY_ADDR = { label: 'Home', street: '', city: '', state: '', pincode: '', phone: '' };

const CONTAINER_VARS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const ITEM_VARS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } }
};

export default function ProfilePage() {
    const { user, updateUser, refetch } = useAuth();
    const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', password: '', confirm: '' });
    const [saving, setSaving] = useState(false);
    const [addrForm, setAddrForm] = useState(null);
    const [addrData, setAddrData] = useState(EMPTY_ADDR);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (profile.password && profile.password !== profile.confirm) return toast.error('Passwords do not match.');
        setSaving(true);
        try {
            const payload = { name: profile.name, email: profile.email };
            if (profile.password) payload.password = profile.password;
            const { data } = await authApi.updateProfile(payload);
            updateUser(data.user);
            setProfile(p => ({ ...p, password: '', confirm: '' }));
            toast.success('Profile Updated');
        } catch (err) {
            toast.error(err.message);
        }
        setSaving(false);
    };

    const handleAddrSubmit = async (e) => {
        e.preventDefault();
        try {
            if (addrForm === 'new') {
                await authApi.addAddress(addrData);
            } else {
                await authApi.updateAddress(addrForm, addrData);
            }
            await refetch();
            setAddrForm(null);
            setAddrData(EMPTY_ADDR);
            toast.success(addrForm === 'new' ? 'Address Added' : 'Address Updated');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteAddr = async (id) => {
        if (!window.confirm('Delete this address?')) return;
        try {
            await authApi.deleteAddress(id);
            await refetch();
            toast.success('Address Deleted');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const startEdit = (addr) => {
        setAddrForm(addr._id);
        setAddrData({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, phone: addr.phone });
    };

    const setAddr = (f) => (e) => setAddrData(p => ({ ...p, [f]: e.target.value }));

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={CONTAINER_VARS}
            className="max-w-7xl mx-auto px-6 py-16"
        >
            {/* Immersive Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20">
                <div className="max-w-2xl">
                    <motion.div variants={ITEM_VARS} className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                            <FiShield size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Profile</span>
                    </motion.div>
                    <motion.h1 variants={ITEM_VARS} className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">
                        My <span className="text-primary-500 italic">Profile</span>
                    </motion.h1>
                    <motion.p variants={ITEM_VARS} className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                        Manage your account settings, security, and addresses
                    </motion.p>
                </div>

                <motion.div variants={ITEM_VARS} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center gap-6 bg-white border border-gray-100 p-6 rounded-[2rem] shadow-2xl">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary-500/20">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-none">{user?.name}</h3>
                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-2 bg-primary-500/5 px-3 py-1 rounded-lg w-fit">
                                {user?.role === 'admin' ? '🛡️ Administrator Access' : 'Verified Member'}
                            </p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                <FiMail className="shrink-0" /> {user?.email}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Profile Controls */}
                <motion.div variants={ITEM_VARS} className="lg:col-span-4">
                    <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] sticky top-32">
                        <h2 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-3 tracking-tighter">
                            <FiUser className="text-primary-500" /> Personal <span className="text-primary-500">Details</span>
                        </h2>
                        <form onSubmit={handleProfileSave} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" />
                                </div>
                            </div>
                            <div className="pt-8 border-t border-gray-50 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input type="password" value={profile.password} onChange={e => setProfile(p => ({ ...p, password: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" placeholder="••••••••" />
                                </div>
                            </div>
                            <AnimatePresence>
                                {profile.password && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-2"
                                    >
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input type="password" value={profile.confirm} onChange={e => setProfile(p => ({ ...p, confirm: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" placeholder="••••••••" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={saving}
                                className="w-full py-5 bg-gray-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary-600 transition-colors shadow-2xl shadow-gray-900/10 disabled:opacity-50"
                            >
                                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                {/* Logistics Coordination */}
                <motion.div variants={ITEM_VARS} className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                            <FiMapPin className="text-primary-500" /> Your <span className="text-primary-500">Addresses</span>
                        </h2>
                        {!addrForm && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setAddrForm('new'); setAddrData(EMPTY_ADDR); }}
                                className="px-6 py-3 bg-primary-500/10 text-primary-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-primary-500/5"
                            >
                                <FiPlus /> Add New Address
                            </motion.button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {addrForm ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                onSubmit={handleAddrSubmit}
                                className="bg-white border-2 border-primary-500/10 p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <button type="button" onClick={() => setAddrForm(null)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><FiX size={20} /></button>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tighter">{addrForm === 'new' ? 'Add New Address' : 'Update Address'}</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Label</label>
                                        <select value={addrData.label} onChange={setAddr('label')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all">
                                            <option>Home</option><option>Work</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="relative">
                                            <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input required value={addrData.phone} onChange={setAddr('phone')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" placeholder="(555) 000-0000" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input required value={addrData.street} onChange={setAddr('street')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" placeholder="House/Apt No., Street, Landmark" />
                                        </div>
                                    </div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label><input required value={addrData.city} onChange={setAddr('city')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label><input required value={addrData.state} onChange={setAddr('state')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" /></div>
                                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ZIP / Pincode</label><input required value={addrData.pincode} onChange={setAddr('pincode')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all" maxLength={6} /></div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-12 pt-8 border-t border-gray-50">
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-colors shadow-2xl">Save Address</motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => setAddrForm(null)} className="px-10 py-5 bg-gray-100 text-gray-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancel</motion.button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div key="list" className="grid md:grid-cols-2 gap-8">
                                {!user?.addresses?.length && (
                                    <div className="md:col-span-2 py-32 text-center bg-gray-50 rounded-[3.5rem] border-dashed border-2 border-gray-100">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-xl leading-none">
                                            <FiMapPin size={32} />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">No saved addresses found</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => { setAddrForm('new'); setAddrData(EMPTY_ADDR); }}
                                            className="mt-8 text-[9px] font-black text-primary-500 uppercase tracking-widest flex items-center gap-2 mx-auto"
                                        >
                                            Add an Address <FiArrowRight />
                                        </motion.button>
                                    </div>
                                )}
                                {user?.addresses?.map((addr, idx) => (
                                    <motion.div
                                        key={addr._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all cursor-default"
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${addr.label === 'Home' ? 'bg-primary-500/10 border-primary-500/20 text-primary-500' :
                                                addr.label === 'Work' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' :
                                                    'bg-gray-500/10 border-gray-500/20 text-gray-500'
                                                }`}>
                                                {addr.label}
                                            </span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEdit(addr)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"><FiEdit2 size={16} /></button>
                                                <button onClick={() => handleDeleteAddr(addr._id)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><FiTrash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-1 mb-6">
                                            <p className="text-xl font-black text-gray-900 tracking-tighter leading-tight">{addr.street}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {addr.city}, {addr.state} — {addr.pincode}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 pt-6 border-t border-gray-50 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <FiSmartphone className="text-primary-500" />
                                                <span>{addr.phone}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
}



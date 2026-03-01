import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiUserX, FiUserCheck, FiTrash2, FiUsers, FiShield, FiMapPin, FiMail } from 'react-icons/fi';
import { userApi } from '../../api/orderApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            const { data } = await userApi.getAll(params);
            setUsers(data.users);
        } catch (_) { }
        setLoading(false);
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchUsers, 400);
        return () => clearTimeout(t);
    }, [fetchUsers]);

    const handleToggleBlock = async (id, currentlyBlocked, name) => {
        try {
            await userApi.toggleBlock(id);
            toast.success(`${name} ${currentlyBlocked ? 'unblocked' : 'blocked'}.`);
            fetchUsers();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try {
            await userApi.deleteUser(id);
            toast.success('User deleted.');
            fetchUsers();
        } catch (err) {
            toast.error(err.message);
        }
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
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <FiUsers size={16} />
                        </div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Citizen Directory</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">User <span className="text-blue-500 italic">Base.</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Authorized access control and account auditing</p>
                </div>

                <div className="relative group">
                    <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Identify Subject..."
                        className="bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 transition-all placeholder:text-gray-400 focus:w-80 focus:bg-white"
                    />
                </div>
            </div>

            {/* User Directory Table Container */}
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
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Subject Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Registration</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Coordinates</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Access Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] text-right">Directives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode='popLayout'>
                                    {users.map((user, idx) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`group hover:bg-gray-50 transition-colors ${user.isBlocked ? 'opacity-40 grayscale' : ''}`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/10">
                                                        {user.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900">{user.name}</p>
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">
                                                            <FiMail size={10} />
                                                            <span>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-black text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">First Entry</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <FiMapPin size={12} className="text-gray-600" />
                                                    <span className="text-xs font-black text-gray-900">{user.addresses?.length || 0} Saved</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${user.isBlocked
                                                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                                    : 'bg-primary-500/10 border-primary-500/20 text-primary-500'
                                                    }`}>
                                                    {user.isBlocked ? 'Access Revoked' : 'Clearance Active'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleToggleBlock(user._id, user.isBlocked, user.name)}
                                                        title={user.isBlocked ? 'Authorize Access' : 'Revoke Access'}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${user.isBlocked
                                                            ? 'bg-blue-500/5 text-blue-500 hover:bg-blue-500/10'
                                                            : 'bg-amber-500/5 text-amber-500 hover:bg-amber-500/10'
                                                            }`}
                                                    >
                                                        {user.isBlocked ? <FiUserCheck size={16} /> : <FiUserX size={16} />}
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(user._id, user.name)}
                                                        className="w-10 h-10 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <FiUsers size={32} />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Zero subjects matching signature found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Accounts', value: users.length, icon: FiUsers, color: 'text-blue-500' },
                    { label: 'Authorized Clearances', value: users.filter(u => !u.isBlocked).length, icon: FiShield, color: 'text-primary-500' },
                    { label: 'Blacklisted Subjects', value: users.filter(u => u.isBlocked).length, icon: FiUserX, color: 'text-red-500' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        className="bg-white border border-gray-200 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</p>
                            <h4 className="text-3xl font-black text-gray-900 tracking-tighter mt-1">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}


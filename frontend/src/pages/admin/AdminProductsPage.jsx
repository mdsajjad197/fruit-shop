import { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiSearch, FiPackage, FiFilter, FiMoreVertical } from 'react-icons/fi';
import { productApi } from '../../api/productApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY = { name: '', category: 'Seasonal', price: '', stock: '', description: '', unit: 'kg', isFeatured: false };
const CATEGORIES = ['Seasonal', 'Imported', 'Organic'];

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'add' | product obj
    const [form, setForm] = useState(EMPTY);
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await productApi.getProducts({ limit: 100 });
            setProducts(data.products);
        } catch (_) { }
        setLoading(false);
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const openAdd = () => { setForm(EMPTY); setFiles([]); setModal('add'); };
    const openEdit = (p) => {
        setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, description: p.description, unit: p.unit || 'kg', isFeatured: p.isFeatured || false });
        setFiles([]);
        setModal(p);
    };

    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            files.forEach(f => fd.append('images', f));

            if (modal === 'add') {
                await productApi.create(fd);
                toast.success('Product added!');
            } else {
                await productApi.update(modal._id, fd);
                toast.success('Product updated!');
            }
            setModal(null);
            fetchProducts();
        } catch (err) {
            toast.error(err.message);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        try {
            await productApi.delete(id);
            toast.success('Product deleted.');
            fetchProducts();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                            <FiPackage size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Global Inventory</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Material <span className="text-primary-500 italic">Log.</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Management of organic assets and stock levels</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative group hidden sm:block">
                        <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Identify Asset..."
                            className="bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-64 transition-all placeholder:text-gray-400 focus:w-80 focus:bg-white"
                        />
                    </div>
                    <button onClick={openAdd} className="bg-primary-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary-500/20 hover:-translate-y-1 transition-all flex items-center gap-2">
                        <FiPlus size={16} /> New Asset
                    </button>
                </div>
            </div>

            {/* Inventory Table Container */}
            <div className="bg-white rounded-[3rem] border border-gray-200 overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-10 space-y-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse border border-gray-200" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Asset Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Classification</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Valuation</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Reserve</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Priority</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode='popLayout'>
                                    {filtered.map((p, idx) => (
                                        <motion.tr
                                            key={p._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <img
                                                            src={p.images?.[0]?.url || 'https://placehold.co/100x100/121212/22c55e?text=🍎'}
                                                            alt={p.name}
                                                            className="w-14 h-14 rounded-2xl object-cover bg-gray-100 border border-gray-200"
                                                        />
                                                        {p.stock === 0 && (
                                                            <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                                                                <FiX size={20} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900">{p.name}</p>
                                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">ID: {p._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${p.category === 'Seasonal' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' :
                                                    p.category === 'Organic' ? 'bg-primary-500/10 text-primary-500 border-primary-500/10' :
                                                        'bg-blue-500/10 text-blue-500 border-blue-500/10'
                                                    }`}>
                                                    {p.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900">₹{p.price}</p>
                                                <p className="text-[10px] font-black text-gray-600 uppercase mt-0.5">Per {p.unit}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-between min-w-[80px]">
                                                        <span className={`text-xs font-black ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-primary-500'}`}>
                                                            {p.stock}
                                                        </span>
                                                        <span className="text-[9px] font-black text-gray-600 uppercase">Audit</span>
                                                    </div>
                                                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-20">
                                                        <div
                                                            className={`h-full ${p.stock === 0 ? 'bg-red-500' : p.stock < 10 ? 'bg-amber-500' : 'bg-primary-500'}`}
                                                            style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${p.isFeatured ? 'text-primary-500' : 'text-gray-700'}`}>
                                                    {p.isFeatured ? '★ High' : '○ Standard'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => openEdit(p)}
                                                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(p._id, p.name)}
                                                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <FiSearch size={32} />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">No matching assets found in protocol</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal - Modern Glass Form */}
            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModal(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white border border-gray-200 w-full max-w-2xl rounded-[3rem] overflow-hidden relative shadow-2xl max-h-full flex flex-col"
                        >
                            <div className="p-10 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{modal === 'add' ? 'New Asset' : 'Edit Asset'}</h2>
                                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1">Configure Harvest Protocol</p>
                                </div>
                                <button onClick={() => setModal(null)} className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Asset Nomenclature</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={set('name')}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all placeholder:text-gray-400"
                                            placeholder="e.g. Imperial Blood Orange"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Classification</label>
                                        <select
                                            value={form.category}
                                            onChange={set('category')}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white appearance-none cursor-pointer"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-white">{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Metric Unit</label>
                                        <input
                                            value={form.unit}
                                            onChange={set('unit')}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all placeholder:text-gray-400"
                                            placeholder="kg, piece, etc."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Valuation (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={form.price}
                                            onChange={set('price')}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Reserve Count</label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={form.stock}
                                            onChange={set('stock')}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Manifest Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={form.description}
                                            onChange={set('description')}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-3xl py-5 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all resize-none placeholder:text-gray-400"
                                            placeholder="System data regarding asset origins and profile..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-200">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={form.isFeatured}
                                            onChange={set('isFeatured')}
                                            className="w-6 h-6 rounded-lg accent-primary-500 cursor-pointer"
                                        />
                                        <label htmlFor="featured" className="text-xs font-black text-gray-900 uppercase tracking-widest cursor-pointer">Elevate to High Priority (Featured)</label>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Visual Data (Images)</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 text-center hover:border-primary-500/50 hover:bg-primary-50 transition-all group/upload relative overflow-hidden">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                id="img-upload"
                                                className="hidden"
                                                onChange={e => setFiles(Array.from(e.target.files))}
                                            />
                                            <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center gap-6">
                                                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover/upload:text-primary-500 group-hover/upload:scale-110 transition-all">
                                                    <FiUpload size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-gray-900">{files.length > 0 ? `${files.length} Assets Selected` : 'Transfer Image Data'}</p>
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Maximum 6 fragments per asset</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 shrink-0 mt-auto">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] bg-primary-500 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {submitting ? 'Synchronizing...' : modal === 'add' ? 'Commit New Asset' : 'Sync Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModal(null)}
                                        className="flex-1 bg-gray-100 text-gray-600 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-200 hover:text-gray-900 transition-all shadow-sm"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}


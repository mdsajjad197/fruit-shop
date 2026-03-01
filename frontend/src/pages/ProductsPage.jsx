import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { productApi } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Seasonal', 'Imported', 'Organic'];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const category = searchParams.get('category') || 'All';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12, sort };
            if (category !== 'All') params.category = category;
            if (search) params.search = search;
            const { data } = await productApi.getProducts(params);
            setProducts(data.products);
            setTotal(data.total);
        } catch (_) { }
        setLoading(false);
    }, [category, search, sort, page]);

    useEffect(() => {
        fetchProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchProducts]);

    const setParam = (key, value) => {
        const p = new URLSearchParams(searchParams);
        if (value) p.set(key, value); else p.delete(key);
        if (key !== 'page') p.delete('page');
        setSearchParams(p);
        setPage(1);
    };

    const clearSearch = () => setParam('search', '');

    const totalPages = Math.ceil(total / 12);

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Page Hero Header */}
            <section className="relative pt-32 pb-20 bg-[#f8fafc] overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/5 -skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-xl shadow-primary-500/5 border border-primary-50 mb-6">
                            <FiActivity size={14} className="text-primary-500" />
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{total} Products</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                            Our <span className="text-primary-500 italic">Fresh</span> Products
                        </h1>
                        <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
                            Discover the finest selection of organic fruits, handpicked daily from sustainable gardens.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Search Bar */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white/80 backdrop-blur-xl border border-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-primary-500/10 flex flex-col lg:flex-row items-center gap-6">
                    {/* Search Input */}
                    <div className="relative w-full lg:w-96 group">
                        <FiSearch size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search fresh products..."
                            value={search}
                            onChange={(e) => setParam('search', e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        />
                        {search && (
                            <button onClick={clearSearch} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
                                <FiX size={18} />
                            </button>
                        )}
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl overflow-x-auto no-scrollbar w-full lg:w-auto">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setParam('category', c === 'All' ? '' : c)}
                                className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${category === c
                                    ? 'bg-white text-primary-500 shadow-md translate-y-0'
                                    : 'text-gray-400 hover:text-gray-900'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative w-full lg:w-auto lg:ml-auto">
                        <FiFilter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                            value={sort}
                            onChange={(e) => setParam('sort', e.target.value)}
                            className="w-full lg:w-64 bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-10 text-xs font-black uppercase tracking-widest text-gray-900 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <FiChevronRight className="rotate-90" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid Section */}
            <div className="container mx-auto px-4 mt-16">
                <AnimatePresence mode='wait'>
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
                        >
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                        </motion.div>
                    ) : products.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-40 bg-gray-50 rounded-[4rem] border border-dashed border-gray-200"
                        >
                            <div className="relative mb-8 group inline-block">
                                <div className="absolute inset-0 bg-primary-500/10 blur-[80px] rounded-full" />
                                <img
                                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop"
                                    alt="No Products"
                                    className="relative w-48 h-48 object-cover rounded-[3rem] mx-auto shadow-xl -rotate-6 group-hover:rotate-0 transition-transform duration-700"
                                />
                            </div>

                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">No products found</h2>
                            <p className="text-gray-400 font-bold mb-10">Try adjusting your filters or clear them to see all products.</p>
                            <button
                                onClick={() => { setSearchParams({}); setPage(1); }}
                                className="bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                            >
                                Reset Filters
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.05 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
                        >
                            {products.map((p) => (
                                <motion.div
                                    key={p._id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-20 gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-500 disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-xl shadow-primary-500/5 group"
                        >
                            <FiChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-14 h-14 rounded-2xl text-xs font-black transition-all ${page === i + 1
                                        ? 'bg-primary-500 text-white shadow-2xl shadow-primary-500/40 translate-y-[-4px]'
                                        : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-500 disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-xl shadow-primary-500/5 group"
                        >
                            <FiChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiHeart, FiLogOut, FiSettings, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Seasonal', 'Organic', 'Imported', 'Fruits', 'Vegetables'];

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            let url = `/products?search=${encodeURIComponent(searchQuery)}`;
            if (selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;
            navigate(url);
        }
    };

    if (pathname.startsWith('/admin')) return null;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
            ? 'py-3 bg-white/80 backdrop-blur-2xl shadow-xl shadow-primary-500/5'
            : 'py-6 bg-transparent'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-8">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="relative">
                            <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 block">🍒</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-gray-900 tracking-tighter leading-none mb-0.5">
                                Caz<span className="text-primary-500">Fruits</span>
                            </span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Fresh & Organic</span>
                        </div>
                    </Link>

                    {/* Integrated Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-xl">
                        <form onSubmit={handleSearch} className="w-full relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-primary-500 h-12 pl-12 pr-32 rounded-2xl text-sm font-medium transition-all outline-none"
                            />

                        </form>
                    </div>

                    {/* Navigation Links & Actions */}
                    <div className="flex items-center gap-2 md:gap-6">

                        {/* Desktop Nav Links */}
                        <div className="hidden xl:flex items-center gap-8 mr-4">
                            <Link to="/" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary-500 transition-colors">Home</Link>
                            <Link to="/products" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary-500 transition-colors">Products</Link>
                            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary-500 transition-colors">Our Story</Link>
                        </div>

                        {/* Cart Button */}
                        <Link to="/cart" className="relative p-3 bg-gray-50 rounded-2xl text-gray-900 hover:bg-primary-500 hover:text-white hover:shadow-lg hover:shadow-primary-500/20 transition-all group">
                            <FiShoppingCart size={20} />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-primary-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white group-hover:bg-white group-hover:text-primary-500"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Account/Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center gap-2 p-1.5 pr-4 rounded-2xl transition-all ${isProfileOpen ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-lg overflow-hidden">
                                    {user?.avatar?.url ? (
                                        <img src={user.avatar.url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <FiUser size={16} />
                                    )}
                                </div>
                                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">
                                    {user ? user.name.split(' ')[0] : 'Account'}
                                </span>
                                <FiChevronDown className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-50 p-3 z-50 overflow-hidden"
                                    >
                                        {user ? (
                                            <div className="space-y-1">
                                                <div className="px-4 py-3 bg-gray-50 rounded-2xl mb-2">
                                                    <p className="text-xs font-black text-gray-900 truncate tracking-tight">{user.name}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                                                </div>
                                                {user.role === 'admin' && (
                                                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">
                                                        <FiSettings size={14} className="text-primary-500" /> Admin Dashboard
                                                    </Link>
                                                )}
                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary-500 transition-colors">
                                                    <FiUser size={14} /> Profile
                                                </Link>
                                                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary-500 transition-colors">
                                                    <FiShoppingBag size={14} /> Orders
                                                </Link>
                                                <div className="h-px bg-gray-100 my-2 mx-2" />
                                                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-colors">
                                                    <FiLogOut size={14} /> Logout
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Link to="/login" className="block w-full py-4 bg-primary-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-primary-500/20 hover:scale-[1.02] transition-transform">
                                                    Login
                                                </Link>
                                                <Link to="/register" className="block w-full py-4 bg-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-gray-200 transition-colors">
                                                    Register
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-3 bg-gray-50 rounded-2xl text-gray-900 transition-colors"
                        >
                            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            <div className="lg:hidden container mx-auto px-4 mt-4">
                <form onSubmit={handleSearch} className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none h-11 pl-11 pr-4 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                </form>
            </div>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[110]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-white z-[120] shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-xl font-black tracking-tighter">Main <span className="text-primary-500">Menu</span></span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-xl"><FiX size={20} /></button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Link to="/products" className="p-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900">Products</Link>
                                <Link to="/about" className="p-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900">About Us</Link>
                                <Link to="/contact" className="p-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900">Contact Us</Link>
                            </div>

                            <div className="mt-auto pt-10 border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Social Media</p>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">FB</div>
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">IG</div>
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">TW</div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}

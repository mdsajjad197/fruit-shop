import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CATEGORIES = [
    {
        id: 'raspberries',
        name: 'Raspberries',
        query: 'Imported', // Uses actual category
        image: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?q=80&w=400&auto=format&fit=crop',
        bgColor: 'bg-[#fff1f2]',
        accentColor: 'text-rose-500',
    },
    {
        id: 'mango',
        name: 'Mango',
        query: 'Seasonal', // Uses actual category
        image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuZ298ZW58MHx8MHx8fDA%3D',
        bgColor: 'bg-[#fffbeb]',
        accentColor: 'text-amber-500',
    },
    {
        id: 'grapes',
        name: 'Grapes',
        query: 'Seasonal', // Uses actual category
        image: 'https://images.unsplash.com/photo-1629350542029-012f85a6f9e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjkwfHxmcnVpdHN8ZW58MHx8MHx8fDA%3D',
        bgColor: 'bg-[#faf5ff]',
        accentColor: 'text-purple-500',
    },
    {
        id: 'fruits',
        name: 'Organic Mix',
        query: 'Organic', // Uses actual category
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format&fit=crop',
        bgColor: 'bg-[#f0fdf4]',
        accentColor: 'text-primary-500',
    },
];

export default function CircularCategoryList() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent -z-0" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-8">
                    <div className="text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4"
                        >
                            <FiZap size={14} /> Shop by Category
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                            Our <span className="text-primary-500 italic">Fresh</span><br />
                            Categories
                        </h2>
                    </div>
                    <div className="max-w-xs text-center md:text-right">
                        <p className="text-gray-400 text-sm font-bold leading-relaxed mb-4">
                            Explore our wide selection of fresh, organic fruits handpicked for you.
                        </p>
                        <Link to="/products" className="text-xs font-black text-primary-500 uppercase tracking-widest hover:text-gray-900 transition-colors inline-flex items-center gap-2">
                            View All Products <FiArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
                    {CATEGORIES.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={`/products?category=${cat.query}`}
                                className="group flex flex-col items-center text-center"
                            >
                                {/* Organic Blob Container */}
                                <div className="relative w-40 h-40 md:w-56 md:h-56 mb-8 mx-auto">
                                    {/* Animated blob background */}
                                    <motion.div
                                        animate={{
                                            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "30% 60% 70% 40% / 50% 60% 30% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
                                        }}
                                        transition={{ duration: 10 + index, repeat: Infinity, ease: "easeInOut" }}
                                        className={`absolute inset-0 ${cat.bgColor} -z-10 group-hover:scale-110 transition-transform duration-700`}
                                    />

                                    {/* Image component */}
                                    <div className="w-full h-full flex items-center justify-center p-4 relative z-10">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Floating Indicator */}
                                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-900 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 border border-gray-50 scale-0 group-hover:scale-100">
                                        <FiArrowRight size={20} />
                                    </div>
                                </div>

                                {/* Typography */}
                                <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tighter transition-colors group-hover:text-primary-500 capitalize">
                                    {cat.name}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-primary-600 transition-colors">
                                    Organic
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}


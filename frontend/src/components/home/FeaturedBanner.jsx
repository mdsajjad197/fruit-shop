import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield } from 'react-icons/fi';

export default function FeaturedBanner() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Banner: Organic Garden */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex-1 rounded-[3rem] bg-[#1a2e1d] p-12 relative overflow-hidden group min-h-[450px] flex items-center"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full" />
                        <div className="relative z-10 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6"
                            >
                                <FiShield /> Quality Certified
                            </motion.div>
                            <h3 className="text-5xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                                Fresh From <br /> <span className="text-primary-500 italic">Organic</span> <br /> Garden
                            </h3>
                            <Link to="/products" className="group/btn relative overflow-hidden bg-primary-500 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 inline-flex items-center gap-3 shadow-2xl shadow-primary-500/20">
                                Discover All <FiArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        {/* Decorative floating fruit images */}
                        <div className="absolute -bottom-8 -right-8 p-8 opacity-50 group-hover:opacity-100 transition-all duration-700 group-hover:-translate-y-4">
                            <img
                                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop"
                                alt="Organic Vegetables"
                                className="w-56 h-56 object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl border-4 border-white/10"
                            />
                        </div>
                    </motion.div>

                    {/* Right Banner: Fresh Vegetables */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 rounded-[3rem] bg-[#fdf2f2] p-12 relative overflow-hidden group min-h-[450px] flex items-center border border-rose-100"
                    >
                        <div className="relative z-10 w-full">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-6 block">Farm to Table</span>
                            <h3 className="text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                                Seasonal <br /> <span className="text-rose-500 italic">Antioxidant</span> <br /> Berries
                            </h3>
                            <Link to="/products" className="group/btn relative overflow-hidden bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 inline-flex items-center gap-3 shadow-2xl shadow-gray-900/10">
                                Fresh Harvest <FiArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="absolute -bottom-8 -right-8 p-8 opacity-50 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-1000 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=400&auto=format&fit=crop"
                                alt="Berries"
                                className="w-64 h-64 object-cover rounded-[3rem] shadow-2xl border-4 border-white/40 -rotate-12 group-hover:rotate-0"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function PromoBanners() {
    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Banner 1: Organic Freshness */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 rounded-[2.5rem] overflow-hidden relative min-h-[320px] bg-[#fbba63] group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-500 group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10 h-full flex items-center p-10">
                            <div className="w-1/2">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em] mb-4 block"
                                >
                                    Seasonal Fresh
                                </motion.span>
                                <h3 className="text-4xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                                    Golden <br /> <span className="text-gray-900 italic">Sweetness</span> <br /> Selection
                                </h3>
                                <Link to="/products?category=Seasonal" className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-900/10 hover:bg-gray-900 hover:text-white transition-all">
                                    Shop Now <FiArrowRight size={16} />
                                </Link>
                            </div>
                            <div className="w-1/2 relative h-full flex items-center justify-center p-4">
                                <motion.img
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=400&auto=format&fit=crop"
                                    alt="Juicy"
                                    className="w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-amber-300 transform translate-x-4 rotate-3"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Banner 2: Health Boost */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 rounded-[2.5rem] overflow-hidden relative min-h-[320px] bg-[#fd746c] group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-600 group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10 h-full flex items-center p-10">
                            <div className="w-1/2 relative h-full flex items-center justify-center p-4">
                                <motion.img
                                    animate={{ rotate: [-3, 3, -3], scale: [1, 1.02, 1] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    src="https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYzfHxmcnVpdHN8ZW58MHx8MHx8fDA%3D"
                                    alt="Healthy"
                                    className="w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-rose-300 transform -translate-x-4 -rotate-3"
                                />
                            </div>
                            <div className="w-1/2">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em] mb-4 block"
                                >
                                    Healthy Boost
                                </motion.span>
                                <h3 className="text-4xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                                    Purely <br /> <span className="text-gray-900 italic">Organic</span> <br /> Freshness
                                </h3>
                                <Link to="/products?category=Organic" className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/10 hover:bg-white hover:text-gray-900 transition-all">
                                    Shop Now <FiArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}


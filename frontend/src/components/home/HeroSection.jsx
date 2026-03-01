import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#fafdfb] pt-16 pb-32 md:pt-24 md:pb-48">
            {/* Organic Decorative Background Elements */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary-100/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-100/20 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

                    {/* Left: Content Column */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-3 bg-white shadow-xl shadow-primary-500/10 border border-primary-50 px-5 py-2.5 rounded-full mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-ping" />
                            <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Freshly Harvested</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-7xl xl:text-8xl font-black text-gray-900 leading-[0.95] tracking-tighter mb-8"
                        >
                            Fresh & <span className="text-primary-500">Organic</span><br />
                            <span className="relative inline-block mt-2">
                                <span className="relative z-10 text-nowrap italic">Fruits</span>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className="absolute bottom-2 left-0 h-4 bg-accent-500/20 -z-0 rounded-full"
                                />
                            </span><br />
                            Store
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-500 mb-12 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0"
                        >
                            Discover premium, farm-fresh organic fruits delivered straight to your door.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
                        >
                            <Link to="/products" className="group relative overflow-hidden bg-primary-500 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary-500/30 transition-all hover:scale-105 active:scale-95">
                                <span className="relative z-10 flex items-center gap-2">Shop Now <FiArrowRight size={16} /></span>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                            </Link>
                        </motion.div>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-16 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-100 pt-10"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-500 text-white text-[10px] flex items-center justify-center font-black">2k+</div>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => <FiStar key={i} size={14} className="fill-current" />)}
                                </div>
                                <span className="text-xs font-black text-gray-400 tracking-tight">Trusted by 50,000+ Happy Customers</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Visual Composition */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative w-full max-w-[600px] mx-auto aspect-square flex items-center justify-center"
                        >
                            {/* Animated Background Blob */}
                            <motion.div
                                animate={{
                                    borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "30% 60% 70% 40% / 50% 60% 30% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-4 bg-primary-100/50 -z-10 blur-3xl"
                            />

                            {/* Hero Image Component */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 w-full h-full p-8"
                            >
                                {/* Fallback Organic Fruit Composition - Modern Unsplash Version */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-full h-full">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute inset-4 border-2 border-dashed border-primary-200/50 rounded-[4rem]" />

                                        {/* Strawberries */}
                                        <motion.img
                                            animate={{ y: [0, -15, 0], rotate: [5, -5, 5] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 object-cover rounded-[4rem] z-10 shadow-2xl shadow-primary-500/10 border-4 border-white"
                                        />

                                        {/* Orange */}
                                        <motion.img
                                            animate={{ y: [0, 20, 0], rotate: [-10, 10, -10] }}
                                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                            src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=500&auto=format&fit=crop"
                                            className="absolute top-10 right-10 w-40 h-40 object-cover rounded-[3rem] shadow-xl border-4 border-white"
                                        />

                                        {/* Green Apple */}
                                        <motion.img
                                            animate={{ y: [0, -25, 0], rotate: [15, -15, 15] }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                            src="https://plus.unsplash.com/premium_photo-1671379086168-a5d018d583cf?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            className="absolute bottom-10 left-10 w-44 h-44 object-cover rounded-[3rem] shadow-xl border-4 border-white"
                                        />

                                        {/* Lime/Lemon accent */}
                                        <motion.img
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            src="https://images.unsplash.com/photo-1649502756343-0d48ee4d384e?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU4fHxmcnVpdHN8ZW58MHx8MHx8fDA%3D"
                                            className="absolute top-1/4 left-1/4 w-24 h-24 object-cover rounded-[2rem] shadow-lg border-2 border-white -rotate-12"
                                        />
                                    </div>
                                </div>

                            </motion.div>

                            {/* Floating Stats Badges */}
                            <motion.div
                                animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-1/4 right-8 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/50 z-20 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 font-black">100%</div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Organic</p>
                                    <p className="text-xs font-black text-gray-900 uppercase">Certified Pure</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}


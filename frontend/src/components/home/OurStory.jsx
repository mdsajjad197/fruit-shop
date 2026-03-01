import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

export default function OurStory() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left side: Images Composition */}
                    <div className="w-full lg:w-1/2 relative">
                        {/* Decorative Background Blob */}
                        <motion.div
                            animate={{
                                borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "30% 60% 70% 40% / 50% 60% 30% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -inset-4 bg-primary-50 -z-10"
                        />

                        <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
                            <motion.img
                                initial={{ scale: 1.1 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5 }}
                                viewport={{ once: true }}
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                                alt="Organic Farm"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                viewport={{ once: true }}
                                className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-3xl font-black text-gray-900 leading-none">25+</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Years of Farming</p>
                                </div>
                                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/30">
                                    100%
                                </div>
                            </motion.div>
                        </div>

                        {/* Floating Small Image */}
                        <motion.img
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format&fit=crop"
                            alt="Fresh Harvest"
                            className="absolute -right-8 top-1/4 w-48 h-48 object-cover rounded-[2rem] shadow-2xl border-8 border-white hidden md:block"
                        />
                    </div>

                    {/* Right side: Content */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block inline-flex items-center gap-2">
                                <span className="w-8 h-px bg-primary-500"></span> Our Story
                            </span>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-8">
                                Cultivating <span className="text-primary-500 italic">Nature's</span><br />
                                Finest Since 1999
                            </h2>

                            <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                We started with a simple belief: the best tasting fruits come from healthy soil and careful cultivation. What began as a small family orchard has grown into a passionate community of farmers dedicated to sustainable, organic agriculture.
                            </p>

                            <div className="space-y-4 mb-10">
                                {[
                                    '100% Certified Organic Produce',
                                    'Sustainable Farming Practices',
                                    'Direct from Farm to Your Door',
                                    'No Artificial Pesticides or Chemicals'
                                ].map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                                            <FiCheckCircle size={14} className="stroke-[3]" />
                                        </div>
                                        <span className="text-gray-900 font-bold text-sm">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-6"
                            >
                                {/* Signature */}
                                <div className="font-['Brush_Script_MT',cursive] text-4xl text-gray-800 -rotate-3">
                                    Rayees
                                </div>
                                <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                                    Founder
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

import { Link } from 'react-router-dom';
import { FiPhoneCall, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-[#0a1a0d] text-white/60 pt-20 pb-8 overflow-hidden relative border-t border-white/5">
            {/* Minimal Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 mb-6 group">
                    <span className="text-5xl group-hover:rotate-12 transition-transform duration-500 drop-shadow-lg">🍒</span>
                    <div className="flex flex-col text-left">
                        <span className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                            Caz<span className="text-primary-500">Fruits</span>
                        </span>
                        <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] leading-none">Nature's Best Harvest</span>
                    </div>
                </Link>

                <p className="text-white/40 text-sm mb-10 max-w-lg font-medium leading-relaxed">
                    Experience the pinnacle of freshness. We bridge the gap between organic farms and your table, delivering nature's finest harvests with uncompromising quality.
                </p>

                {/* Socials & Contact Simple inline */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10">
                    <a href="mailto:cazfruits@gmail.com" className="flex items-center gap-3 hover:text-primary-500 transition-colors text-xs font-black tracking-[0.2em] uppercase bg-white/5 px-6 py-3 rounded-full hover:bg-white/10">
                        <FiMail size={14} className="text-primary-500" /> cazfruits@gmail.com
                    </a>
                    <a href="tel:+916383016638" className="flex items-center gap-3 hover:text-primary-500 transition-colors text-xs font-black tracking-[0.2em] uppercase bg-white/5 px-6 py-3 rounded-full hover:bg-white/10">
                        <FiPhoneCall size={14} className="text-primary-500" /> 63830 16638
                    </a>
                </div>

                <div className="flex gap-4 mb-16">
                    {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
                        <motion.a
                            key={i}
                            href="#"
                            whileHover={{ y: -4, scale: 1.1 }}
                            className="w-12 h-12 rounded-full border border-white/10 text-white/60 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all shadow-lg"
                        >
                            <Icon size={16} />
                        </motion.a>
                    ))}
                </div>

                {/* Copyright */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-xs font-bold tracking-tight text-white/30 px-4 xl:px-8">
                    <p>© 2026 CazFruits Farm. Harvested with love.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-primary-500 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary-500 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}


import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import SkeletonCard from '../SkeletonCard';
import { motion } from 'framer-motion';

export default function ProductCarousel({ title, subtitle, products, isLoading, viewAllLink }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="text-center md:text-left">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-3 block"
                        >
                            Fresh Picks
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                            {title.split(' ')[0]} <span className="text-primary-500 italic">{title.split(' ').slice(1).join(' ')}</span>
                        </h2>
                        {subtitle && <p className="text-gray-400 text-sm font-bold tracking-tight">{subtitle}</p>}
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                        {viewAllLink && (
                            <Link to={viewAllLink} className="text-xs font-black text-gray-900 uppercase tracking-widest hover:text-primary-500 transition-colors flex items-center gap-2 group">
                                View Entire Harvest <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}

                        {/* Custom Navigation Arrows */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500 hover:border-primary-500 transition-all shadow-xl shadow-primary-500/5 group"
                            >
                                <FiChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500 hover:border-primary-500 transition-all shadow-xl shadow-primary-500/5 group"
                            >
                                <FiChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carousel Track */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 pb-12 pt-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] flex-shrink-0 snap-start">
                                <SkeletonCard />
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] flex-shrink-0 snap-start relative">
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [weight, setWeight] = useState(1); // Default to 1 kg
    const { _id, name, category, price, stock, images, avgRating } = product;
    const image = images?.[0]?.url || 'https://placehold.co/400x400/ffffff/cccccc?text=Fruit';

    const isOrganic = category === 'Organic';

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2rem] border border-gray-100 p-5 relative group hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 flex flex-col h-full overflow-hidden"
        >
            {/* Top Badges & Favorite */}
            <div className="flex justify-between items-start z-10 relative mb-4">
                <div className="flex flex-col gap-1.5">
                    {isOrganic && (
                        <span className="bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary-500/20">
                            ORGANIC
                        </span>
                    )}
                </div>
            </div>

            {/* Product Image Wrapper */}
            <Link to={`/products/${_id}`} className="block relative h-48 mb-6 group-hover:px-2 transition-all duration-500">
                <div className="absolute inset-0 bg-primary-50 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl -z-0 scale-75" />
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700 relative z-10 drop-shadow-xl"
                    loading="lazy"
                />
            </Link>

            {/* Product Meta */}
            <div className="flex flex-col flex-grow relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{category || 'Produce'}</span>
                    <div className="flex items-center gap-1">
                        <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[11px] font-black text-gray-900">{avgRating || '4.8'}</span>
                    </div>
                </div>

                <Link to={`/products/${_id}`} className="block mb-2">
                    <h3 className="font-black text-gray-900 text-lg leading-tight hover:text-primary-600 transition-colors line-clamp-1 tracking-tight">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                    <select
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        onClick={(e) => e.preventDefault()}
                        className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg outline-none cursor-pointer border border-gray-200"
                    >
                        <option value={0.5}>0.5 kg</option>
                        <option value={1}>1 kg</option>
                    </select>
                    <div className={`w-1.5 h-1.5 rounded-full ${stock > 0 ? 'bg-primary-500' : 'bg-red-500'} animate-pulse ml-auto`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${stock > 0 ? 'text-primary-600' : 'text-red-600'}`}>
                        {stock > 0 ? 'Fresh Harvest' : 'Out of Stock'}
                    </span>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-gray-900 text-2xl font-black tracking-tighter">
                            ₹{(price * weight).toFixed(2)}
                        </span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.preventDefault(); addToCart(product, weight); }}
                        disabled={stock === 0}
                        className="w-12 h-12 flex items-center justify-center bg-primary-500 text-white rounded-2xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all disabled:opacity-30 disabled:grayscale group/btn"
                    >
                        <FiPlus size={24} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}


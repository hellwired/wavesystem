'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    discount?: number;
    offerExpiresAt?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, image, category, discount, offerExpiresAt }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative h-64 w-full bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {discount && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm w-fit">
                            -{discount}% OFF
                        </span>
                    )}
                    {offerExpiresAt && (
                        <span className="bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 w-fit">
                            <Clock size={10} />
                            Exp: {new Date(offerExpiresAt).toLocaleDateString()}
                        </span>
                    )}
                </div>

                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <Heart size={18} />
                </button>

                <Link href={`/articulos-del-sur/producto/${id}`} className="relative w-full h-full block">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        {/* Using a placeholder div for now if image is not available, or standard img tag */}
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            {/* In a real app, use next/image here */}
                            <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* Content */}
            <div className="p-5">
                <p className="text-xs font-medium text-orange-500 mb-1 uppercase tracking-wide">{category}</p>
                <Link href={`/articulos-del-sur/producto/${id}`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3.5rem] hover:text-orange-600 transition-colors">{title}</h3>
                </Link>

                <div className="flex items-end justify-between mt-4">
                    <div>
                        {discount ? (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400 line-through">${price.toLocaleString()}</span>
                                <span className="text-xl font-bold text-slate-900">
                                    ${(price * (1 - discount / 100)).toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xl font-bold text-slate-900">${price.toLocaleString()}</span>
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-slate-900/20"
                    >
                        <ShoppingCart size={20} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

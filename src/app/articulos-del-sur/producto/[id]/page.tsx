'use client';
import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    interface Product {
        id: number;
        name: string;
        price: string; // MySQL decimal comes as string usually or number depending on driver settings, safely handle both
        description: string;
        image_url: string;
        stock: number;
        category_name?: string;
    }

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/next/api/products/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => setProduct(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
                <Link href="/articulos-del-sur/productos" className="text-orange-600 hover:underline">Volver al catálogo</Link>
            </div>
        );
    }

    // Default image fallback
    const image = product.image_url ? `/next/${product.image_url}` : 'https://placehold.co/600x400/png?text=Sin+Imagen';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/articulos-del-sur/productos" className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Volver al catálogo
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Gallery */}
                <div className="space-y-4">
                    <motion.div
                        layoutId={`product-image-${product.id}`}
                        className="bg-white rounded-3xl p-8 border border-gray-100 flex items-center justify-center h-[500px]"
                    >
                        <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </motion.div>
                </div>

                {/* Product Info */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Envío Gratis
                        </span>
                        {product.stock > 0 ? (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                En Stock
                            </span>
                        ) : (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Sin Stock
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>

                    <div className="flex items-end gap-4 mb-8">
                        <span className="text-4xl font-bold text-slate-900">${Number(product.price).toLocaleString()}</span>
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Truck className="text-orange-500" size={24} />
                            <div>
                                <span className="font-bold block">Llega gratis mañana</span>
                                <span className="text-sm text-gray-600">Comprando en las próximas 4 horas</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <ShieldCheck className="text-orange-500" size={24} />
                            <div>
                                <span className="font-bold block">Garantía asegurada</span>
                                <span className="text-sm text-gray-600">12 meses de garantía de fábrica</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center border border-gray-200 rounded-xl">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-4 hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-4 hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <button
                            disabled={product.stock === 0}
                            className="flex-1 bg-orange-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart size={24} />
                            {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'description' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Descripción
                    </button>
                </div>
                <div className="p-8">
                    {activeTab === 'description' && (
                        <div className="prose max-w-none text-gray-600">
                            <p>{product.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

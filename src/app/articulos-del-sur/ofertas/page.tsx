'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Loader2, Tag } from 'lucide-react';

export default function OfertasPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/next/api/products?offer=true');
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.map((p: any) => ({
                        id: p.id,
                        title: p.name,
                        price: Number(p.price),
                        category: p.category_name,
                        image: p.image_url ? `/next/${p.image_url}` : 'https://placehold.co/400x300/png?text=Sin+Imagen',
                        discount: p.discount_percentage,
                        offerExpiresAt: p.offer_expires_at
                    }));
                    setProducts(mapped);
                }
            } catch (error) {
                console.error('Error loading offers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Banner */}
            <div className="bg-orange-600 py-16 px-4 sm:px-6 lg:px-8 mb-12">
                <div className="max-w-[1920px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                            <Tag className="text-white w-8 h-8" />
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Ofertas Especiales
                        </h1>
                        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                            Aprovecha los mejores descuentos en tecnología y electrodomésticos por tiempo limitado.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No hay ofertas disponibles en este momento</h3>
                        <p className="text-gray-500">Vuelve pronto para ver nuevas promociones.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

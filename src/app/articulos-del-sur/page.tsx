'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './components/ProductCard';

export default function ArticulosDelSurHome() {
    const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/next/api/products?featured=true');
                if (res.ok) {
                    const data = await res.json();
                    // Map API key names to Component prop names
                    const mapped = data.map((p: any) => ({
                        id: p.id,
                        title: p.name,
                        price: Number(p.price),
                        category: p.category_name,
                        image: p.image_url ? `/next/${p.image_url}` : 'https://placehold.co/400x300/png?text=Sin+Imagen',
                        discount: p.is_offer ? p.discount_percentage : 0
                    }));
                    setFeaturedProducts(mapped);
                }
            } catch (error) {
                console.error('Error loading featured products:', error);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

                <div className="relative max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 xl:py-48">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold mb-6 border border-orange-500/30">
                            NUEVA TEMPORADA 2025
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight">
                            Tecnología que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                transforma tu hogar
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Descubre la mejor selección de electrodomésticos y tecnología con envíos a todo el país y garantía oficial.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/articulos-del-sur/productos" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-all hover:scale-105 shadow-lg shadow-orange-600/30">
                                Ver Catálogo
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                            <Link href="#" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/10">
                                Ofertas Especiales
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Banner */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Envío Gratis</h3>
                                <p className="text-sm text-gray-600">En compras superiores a $100.000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                            <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Garantía Oficial</h3>
                                <p className="text-sm text-gray-600">12 meses en todos los productos</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Cuotas Sin Interés</h3>
                                <p className="text-sm text-gray-600">Hasta 12 cuotas con bancos seleccionados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Destacados del Mes</h2>
                        <p className="text-gray-600">Las mejores oportunidades seleccionadas para vos.</p>
                    </div>
                    <Link href="/articulos-del-sur/productos" className="hidden md:flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors">
                        Ver todo <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/articulos-del-sur/productos" className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors">
                        Ver todo <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Categorías Populares</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10"></div>
                            <img src="https://images.unsplash.com/photo-1593784991095-a20506948430?q=80&w=800&auto=format&fit=crop" alt="Televisores" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <h3 className="text-2xl font-bold text-white mb-2">Televisores</h3>
                                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors flex items-center">
                                    Ver productos <ArrowRight size={16} className="ml-2" />
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10"></div>
                            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" alt="Climatización" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <h3 className="text-2xl font-bold text-white mb-2">Climatización</h3>
                                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors flex items-center">
                                    Ver productos <ArrowRight size={16} className="ml-2" />
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer md:col-span-2 lg:col-span-1"
                        >
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10"></div>
                            <img src="https://images.unsplash.com/photo-1571175443880-49e1d58b95da?q=80&w=800&auto=format&fit=crop" alt="Cocina" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <h3 className="text-2xl font-bold text-white mb-2">Cocina</h3>
                                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors flex items-center">
                                    Ver productos <ArrowRight size={16} className="ml-2" />
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

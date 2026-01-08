'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Wind, Snowflake, Droplets, Star } from 'lucide-react';
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
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#38BDF8] selection:text-white">

            {/* Hero Section: The Arctic Breeze */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-[#E0F2FE] to-[#F0F9FF] opacity-80"></div>

                {/* Abstract Ice Shapes */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#BAE6FD] to-transparent rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#7DD3FC] to-transparent rounded-full blur-[120px] opacity-30"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-[#E2E8F0] shadow-sm mb-8">
                            <Snowflake size={16} className="text-[#38BDF8]" />
                            <span className="text-sm font-semibold tracking-wide text-[#334155] uppercase">
                                Nueva Temporada 2026
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-[#0F172A]">
                            Articulos Del Sur <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#38BDF8]">
                                Tecnología y confort para tu hogar
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-[#475569] max-w-2xl mx-auto mb-12 leading-relaxed">
                            Descubre una experiencia de compra tan clara como el hielo.
                            Electrodomésticos premium y tecnología de vanguardia para tu hogar.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/articulos-del-sur/productos"
                                className="group relative overflow-hidden rounded-2xl bg-[#0F172A] px-8 py-4 text-white shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                <span className="relative z-10 flex items-center font-semibold text-lg">
                                    Ver Catálogo <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#38BDF8] to-[#0284C7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>

                            <Link
                                href="#"
                                className="px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-[#E2E8F0] text-[#0F172A] font-semibold hover:bg-white hover:border-[#CBD5E1] transition-all duration-300 shadow-sm hover:shadow-lg"
                            >
                                Ofertas Especiales
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Elements (Glassmorphism) */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-[5%] top-[20%] hidden lg:block p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl w-64 rotate-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-[#E0F2FE] text-[#0284C7]"><Wind size={20} /></div>
                        <span className="font-bold text-[#334155]">Climatización</span>
                    </div>
                    <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden mb-2">
                        <div className="h-full w-[80%] bg-[#38BDF8]"></div>
                    </div>
                    <p className="text-xs text-[#64748B]">Alta demanda esta temporada</p>
                </motion.div>
            </section>

            {/* Features: Clean & Minimal */}
            <section className="py-20 bg-white relative z-10 border-b border-[#F1F5F9]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Truck, title: "Envío Rápido", desc: "Entrega segura en todo el país." },
                            { icon: ShieldCheck, title: "Garantía Total", desc: "Cobertura oficial de 12 meses." },
                            { icon: CreditCard, title: "Cuotas Fijas", desc: "Financiación sin sorpresas." }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="p-5 rounded-3xl bg-[#F8FAFC] text-[#38BDF8] mb-6 group-hover:bg-[#E0F2FE] transition-colors duration-300">
                                    <feature.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                                <p className="text-[#64748B]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products: Icy Cards */}
            <section className="py-32 bg-[#F8FAFC] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-end justify-between mb-16">
                        <div>
                            <span className="text-[#38BDF8] font-bold tracking-wider uppercase text-sm mb-2 block">Selección Premium</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">Favoritos del Mes</h2>
                        </div>
                        <Link href="/articulos-del-sur/productos" className="hidden md:flex items-center gap-2 text-[#0F172A] font-semibold hover:text-[#38BDF8] transition-colors group">
                            Explorar todo <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                        {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                            <div key={product.id} className="group relative">
                                <div className="absolute inset-0 bg-[#38BDF8] rounded-3xl blur-[20px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                <div className="relative bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden hover:border-[#CBD5E1] transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                                    <div className="aspect-[4/3] relative overflow-hidden bg-[#F1F5F9]">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {product.discount > 0 && (
                                            <div className="absolute top-4 left-4 bg-[#0F172A] text-white text-xs font-bold px-3 py-1 rounded-full">
                                                -{product.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs font-bold text-[#94A3B8] mb-1 uppercase tracking-wider">{product.category}</p>
                                        <h3 className="text-lg font-bold text-[#0F172A] mb-4 truncate">{product.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-[#0F172A]">${product.price.toLocaleString()}</span>
                                            <button className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] hover:bg-[#38BDF8] hover:text-white transition-colors">
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-20">
                                <Loader2 className="animate-spin mx-auto text-[#94A3B8] mb-4" />
                                <p className="text-[#64748B]">Cargando productos...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Categories: Minimalist Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative rounded-[3rem] overflow-hidden bg-[#0F172A] p-12 md:p-24 text-center">
                        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Diseñado para durar.
                            </h2>
                            <p className="text-slate-300 text-xl mb-10">
                                Explora nuestras categorías pricipales y encuentra el balance perfecto entre funcionalidad y estética.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {['Climatización', 'Cocina', 'Smart Home', 'Audio'].map((cat) => (
                                    <Link key={cat} href="/articulos-del-sur/productos" className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[#0F172A] transition-all font-medium">
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
}

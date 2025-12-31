'use client';

import React from 'react';
import Navbar from '../../components/organisms/Navbar';
import Footer from '../../components/organisms/Footer';
import { Playfair_Display, Lato } from 'next/font/google';
import { LanguageProvider } from '../../i18n/LanguageContext';

const playfair = Playfair_Display({ subsets: ['latin'] });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'] });

const products = [
    {
        id: 1,
        name: 'Vestido Imperial',
        price: '$120.00',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2883&auto=format&fit=crop',
    },
    {
        id: 2,
        name: 'Blusa Real',
        price: '$85.00',
        image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=2874&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Falda Majestad',
        price: '$95.00',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=2864&auto=format&fit=crop',
    },
    {
        id: 4,
        name: 'Conjunto Soberana',
        price: '$150.00',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2820&auto=format&fit=crop',
    },
];

export default function EcommerceDemo() {
    return (
        <LanguageProvider>
            <div className={`min-h-screen bg-white text-gray-900 ${lato.className} flex flex-col`}>
                <Navbar />

                {/* Hero Section */}
                <section className="relative min-h-[85vh] flex items-center justify-center bg-black overflow-hidden pt-20 pb-10 px-4">
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="relative z-10 text-center text-white p-6 md:p-10 border-4 border-[#D4AF37]/30 backdrop-blur-sm bg-black/30 max-w-5xl mx-auto">
                        <div className="mb-6 md:mb-8">
                            {/* Placeholder for Logo if generation fails */}
                            <div className={`text-5xl md:text-7xl lg:text-9xl font-bold text-[#D4AF37] ${playfair.className} mb-2`}>
                                LE
                            </div>
                            <div className="text-2xl md:text-3xl text-[#D4AF37]">♕</div>
                        </div>
                        <h1 className={`text-4xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-wider ${playfair.className}`}>
                            LINAJE ESCOGIDO
                        </h1>
                        <p className="text-base md:text-xl lg:text-3xl font-light tracking-widest uppercase mb-10 md:mb-14 text-gray-200">
                            Elegancia Digna de la Realeza
                        </p>
                        <button className="px-8 py-3 md:px-12 md:py-5 bg-[#D4AF37] text-black font-bold tracking-widest hover:bg-white transition-colors duration-300 uppercase text-xs md:text-sm lg:text-base">
                            Ver Colección
                        </button>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-16 md:py-24 px-4 bg-stone-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className={`text-3xl md:text-5xl font-bold mb-8 md:mb-10 text-gray-900 ${playfair.className}`}>
                            Nuestra Esencia
                        </h2>
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                            Linaje Escogido no es solo moda, es una declaración de identidad. Diseñamos para la mujer que conoce su valor y camina con propósito. Cada prenda es confeccionada con los más finos tejidos, fusionando la sofisticación moderna con una elegancia atemporal.
                        </p>
                        <div className="mt-10 md:mt-14 w-20 md:w-32 h-1 bg-[#D4AF37] mx-auto"></div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto flex-grow">
                    <h2 className={`text-3xl md:text-5xl font-bold mb-12 md:mb-20 text-center text-gray-900 ${playfair.className}`}>
                        Colección Real
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
                        {products.map((product) => (
                            <div key={product.id} className="group cursor-pointer w-full max-w-sm md:max-w-none">
                                <div className="relative overflow-hidden aspect-[3/4] mb-4 md:mb-6">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                    <button className="absolute bottom-0 left-0 right-0 py-3 md:py-5 bg-white text-black font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs md:text-sm">
                                        Añadir al Carrito
                                    </button>
                                </div>
                                <h3 className={`text-xl md:text-2xl font-medium mb-2 ${playfair.className}`}>{product.name}</h3>
                                <p className="text-[#D4AF37] font-bold text-lg">{product.price}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <Footer />
            </div>
        </LanguageProvider>
    );
}

'use client';

import React from 'react';
import Navbar from '../../components/organisms/Navbar';
import Footer from '../../components/organisms/Footer';
import { LanguageProvider } from '../../i18n/LanguageContext';
import { Wifi, Tv, Zap, Check } from 'lucide-react';

const plans = [
    {
        id: 'internet',
        name: 'Internet Fibra',
        icon: <Wifi size={48} className="text-cyan-400" />,
        price: '$17000.00',
        features: ['500 Mbps Velocidad', 'Fibra Óptica Simétrica', 'Router WiFi 6 Incluido', 'Soporte 24/7'],
        gradient: 'from-cyan-500 to-blue-600',
        delay: '0',
    },
    {
        id: 'cable',
        name: 'TV Cable HD',
        icon: <Tv size={48} className="text-purple-400" />,
        price: '$13000.00',
        features: ['150+ Canales HD', 'Pack Deportes Incluido', 'Grabación en la Nube', 'App Multi-dispositivo'],
        gradient: 'from-purple-500 to-pink-600',
        delay: '100',
    },
    {
        id: 'combo',
        name: 'Internet + Cable',
        icon: <Zap size={48} className="text-yellow-400" />,
        price: '$25000.00',
        popular: true,
        features: ['1 Gbps Velocidad', '200+ Canales HD + 4K', 'HBO y Star+ Incluidos', 'Instalación Prioritaria'],
        gradient: 'from-orange-500 to-red-600',
        delay: '200',
    },
];

export default function SubscriptionsDemo() {
    return (
        <LanguageProvider>
            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
                <Navbar />

                {/* Hero Section */}
                <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-10 px-4">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-[80px] md:blur-[128px] animate-pulse"></div>
                        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[80px] md:blur-[128px] animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-lg leading-tight">
                            Conectividad Sin Límites
                        </h1>
                        <p className="text-lg sm:text-xl md:text-3xl text-gray-300 font-light mb-10 md:mb-16 tracking-wide max-w-3xl mx-auto">
                            "Somos tu mejor opción para estar siempre conectados"
                        </p>
                        <button className="px-8 py-3 md:px-10 md:py-5 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] text-sm md:text-lg uppercase tracking-wider">
                            Ver Planes Disponibles
                        </button>
                    </div>
                </section>

                {/* Plans Section */}
                <section className="py-16 md:py-24 px-4 relative flex-grow">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-20 text-white">
                            Elige tu Experiencia Ideal
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 justify-items-center">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative group p-1 rounded-2xl bg-gradient-to-b ${plan.gradient} hover:scale-105 transition-all duration-500 shadow-2xl w-full max-w-sm md:max-w-none ${plan.id === 'combo' ? 'md:col-span-2 lg:col-span-1' : ''}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                                    <div className="relative h-full bg-slate-800/90 backdrop-blur-xl rounded-xl p-6 md:p-8 flex flex-col items-center border border-white/10">
                                        {plan.popular && (
                                            <div className="absolute -top-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg z-20">
                                                Más Popular
                                            </div>
                                        )}

                                        <div className="mb-6 p-4 bg-white/5 rounded-full ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300 group-hover:scale-110">
                                            {plan.icon}
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2 text-center">{plan.name}</h3>
                                        <div className="text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            {plan.price}<span className="text-lg text-gray-600 font-normal">/mes</span>
                                        </div>

                                        <ul className="space-y-4 w-full mb-8 flex-grow">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-gray-300 text-sm">
                                                    <Check size={16} className="text-green-400 mr-3 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <button className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${plan.popular
                                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-orange-500/50 shadow-lg'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}>
                                            Suscribirme Ahora
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </LanguageProvider>
    );
}

'use client';

import React, { useState } from 'react';

export default function HBConstruccionesPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative flex flex-col w-full min-h-screen">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-hb-bg-light/80 dark:bg-hb-bg-dark/80 border-b border-gray-200 dark:border-[#29382f]">
                <div className="px-4 md:px-10 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="text-hb-primary">
                            <span className="material-symbols-outlined text-4xl">domain</span>
                        </div>
                        <h2 className="text-xl font-serif font-bold tracking-tight text-slate-900 dark:text-hb-bone">
                            HB <span className="text-hb-gold">Construcciones</span> S.A.
                        </h2>
                    </div>
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium hover:text-hb-primary transition-colors" href="#">Proyectos</a>
                        <a className="text-sm font-medium hover:text-hb-primary transition-colors" href="#">Servicios</a>
                        <a className="text-sm font-medium hover:text-hb-primary transition-colors" href="#">Nosotros</a>
                        <button className="bg-hb-primary hover:bg-hb-primary/90 text-hb-bg-dark px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105">
                            Cotizar
                        </button>
                    </nav>
                    {/* Mobile Menu Icon */}
                    <button
                        className="md:hidden text-slate-900 dark:text-hb-bone"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined text-3xl">menu</span>
                    </button>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-hb-bg-light dark:bg-hb-bg-dark border-b border-gray-200 dark:border-[#29382f] p-4 flex flex-col gap-4 shadow-lg">
                        <a className="text-slate-900 dark:text-hb-bone hover:text-hb-primary font-medium" href="#">Proyectos</a>
                        <a className="text-slate-900 dark:text-hb-bone hover:text-hb-primary font-medium" href="#">Servicios</a>
                        <a className="text-slate-900 dark:text-hb-bone hover:text-hb-primary font-medium" href="#">Nosotros</a>
                        <button className="w-full rounded-full h-10 bg-hb-primary text-hb-bg-dark font-bold">Cotizar</button>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-hb-bg-dark via-hb-bg-dark/50 to-transparent z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDugG7Mei1tuGIvNonICBbVdKJuNGNapic6nrmScVtyRa4k0GbCJPPI5FZX2v6tLpi7ib7Uh3swHxZvJzj6woB2IYwOgXP7JICELcWgiV5iD31jhjObBvwtVOR0xGe8GabiPm0sf7-EIKCNNO_qRxkryKCgYgH-bEtb1ACWWTT38Aly2icnrkJsQbUQGp4z-D0FSn_RB5DIiwoRzVexNOTSbqYKtcQjCXbaRJQHVIo80ZG5HrOJRHrCdrZHbsaEJJFbCCaK_x0sgvM")' }}
                    >
                    </div>
                </div>
                <div className="relative z-20 container mx-auto px-4 md:px-10 flex flex-col items-center text-center max-w-4xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-hb-gold/20 border border-hb-gold/30 text-hb-gold text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                        Arquitectura Orgánica en Posadas
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                        Construyendo tus sueños, <br />
                        <span className="italic text-hb-gold">ladrillo a ladrillo</span>
                    </h1>
                    <p className="text-lg md:text-xl text-hb-bone/90 font-light max-w-2xl mb-10 leading-relaxed">
                        Transformamos espacios en experiencias íntimas. Diseño minimalista y construcción sofisticada en el corazón de Misiones.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button className="bg-hb-primary hover:bg-[#25c465] text-hb-bg-dark min-w-[200px] h-14 px-8 rounded-full text-base font-bold transition-all shadow-[0_0_20px_rgba(48,232,122,0.3)] flex items-center justify-center gap-2 group">
                            <span>Cotización de obras</span>
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button className="bg-transparent border border-white/20 hover:bg-white/10 text-white min-w-[200px] h-14 px-8 rounded-full text-base font-medium transition-all backdrop-blur-sm">
                            Ver Portfolio
                        </button>
                    </div>
                </div>
            </section>

            {/* Introduction / Value Prop */}
            <section className="py-20 bg-hb-bg-light dark:bg-hb-bg-dark px-4 md:px-10">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h3 className="text-hb-gold font-bold uppercase tracking-widest text-sm">Nuestra Filosofía</h3>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-hb-bone">
                            Sofisticación en cada detalle, <span className="text-gray-400 dark:text-gray-600">armonía en cada espacio.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            En HB Construcciones S.A., fusionamos el diseño minimalista con una ejecución de obra impecable. Creemos que un hogar no es solo una estructura, sino un refugio íntimo que debe dialogar con su entorno natural.
                        </p>
                        <div className="pt-4 flex gap-8">
                            <div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">15+</p>
                                <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">Años de Experiencia</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">120+</p>
                                <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">Proyectos Entregados</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[500px] rounded-lg overflow-hidden group">
                        <div className="absolute inset-0 bg-hb-bg-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <div
                            className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuASNhdecAjKytMK6bYwQ2uQTh27o59gFtkK6W8yr8-Qwrp-kqclQ5S4wS-mPIRd8Y6GgWXfJ9jCEFUEyW87tiHdwyH2GcjJv2FiPlYaIKuFXMwfq44J27GmivIqdpAsH-q0uBjpsFt0jBDKkzGt8fZQE5niMKjY1E62l2keTWwCbBGb4Sz_5Dy3KRT0phXwlMPUTKLRMED5h1iltiUU6XunsVYSLXqSaXyE88exwfsvWG-CtX44LjhDjxX0Z-frdDHj4sgE0cw5g7I")' }}
                        >
                        </div>
                        {/* Decorative Element */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 border-[1px] border-hb-gold/30 rounded-full z-20 hidden md:block"></div>
                        <div className="absolute -top-10 -right-10 w-60 h-60 border-[1px] border-hb-primary/20 rounded-full z-20 hidden md:block"></div>
                    </div>
                </div>
            </section>

            {/* Projects Carousel */}
            <section className="py-20 border-t border-gray-200 dark:border-[#29382f] bg-hb-bg-light dark:bg-hb-bg-dark overflow-hidden">
                <div className="container mx-auto px-4 md:px-10 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-hb-bone">Proyectos Destacados</h2>
                        <p className="text-gray-500 dark:text-gray-400">Una selección de nuestras obras más recientes en Misiones.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-hb-primary hover:border-hb-primary hover:text-hb-bg-dark transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-hb-primary hover:border-hb-primary hover:text-hb-bg-dark transition-all">
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
                {/* Horizontal Scroll Container */}
                <div className="pl-4 md:pl-10 overflow-x-auto no-scrollbar pb-10">
                    <div className="flex gap-6 w-max">
                        {/* Card 1 */}
                        <div className="w-[300px] md:w-[400px] group cursor-pointer">
                            <div className="h-[250px] md:h-[300px] rounded-xl overflow-hidden mb-4 relative">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_FPu2gc0DlD8wvlqAnnucrf7ArW8RetZTzQ9hze3qYNYnkb2V2vOsxPBGG10s6nJBYoAEUezQxdKFHkQPET91B0KZ3rxKW8gIdwy5NdVI1_jLRPf44KTPe8K3U9ViGz10W760tyWhgL9F35WU0L141fokBT0l1e2N9qg6Er6ywCJfdEVPm4syyH5rV80ImJLgpW4Ax09d7uvQH2wg2tsqjQdPLy0A5kOhZd-yFdAXnyKefnqdFYJf9S-gMXgtKlfb7J1WGSDh-gk")' }}
                                >
                                </div>
                                <div className="absolute top-4 right-4 bg-hb-bg-dark/80 backdrop-blur text-hb-gold text-xs font-bold px-3 py-1 rounded-full z-20 border border-hb-gold/20">
                                    RESIDENCIAL
                                </div>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-hb-bone mb-1 group-hover:text-hb-primary transition-colors">Edificio Altos del Paraná</h3>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                Posadas, Misiones
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div className="w-[300px] md:w-[400px] group cursor-pointer">
                            <div className="h-[250px] md:h-[300px] rounded-xl overflow-hidden mb-4 relative">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5legF9CYY6j3TblerPGdfX7PtzLBbNeQb_W8bVHH4PBq0xq7xG69giHjCoZjtVmKYGQR4RxgVHpB_29_UfnmdEZ-TIkiXEED5m8e8j-ApYXoxpeDO6qw2_EBBaNYv1DaQtlvG3fDMK1T1bP8NcwE1XM3yd4hozSxqWfQSYakHaNxfwvVC-m26K0a8PKm2FMdfKHSgAl15-nTAHVhcDO-WznTuYAzvVCxOsAnF0j_s7dmnmV-raxa2rWR_ocm0mMJCCQ4YRp9WE8I")' }}
                                >
                                </div>
                                <div className="absolute top-4 right-4 bg-hb-bg-dark/80 backdrop-blur text-hb-gold text-xs font-bold px-3 py-1 rounded-full z-20 border border-hb-gold/20">
                                    VIVIENDA UNIFAMILIAR
                                </div>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-hb-bone mb-1 group-hover:text-hb-primary transition-colors">Residencia Los Lapachos</h3>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                Oberá, Misiones
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div className="w-[300px] md:w-[400px] group cursor-pointer">
                            <div className="h-[250px] md:h-[300px] rounded-xl overflow-hidden mb-4 relative">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3Xcc57jbSCIh_Gt8D2Nha30gSMhIWxWUW3AnZ7Pkr8Mmkx7tE4KVq6VX4RohMdtNSPKT_963qAuQiEAWNs_skmVSL6AjPj99FsbI5-2G9Ii5Qd9mrvFeoj7IsVENBHgbRUhw92rBs7XBMwIaGxPH1Hlfp5ZvT3MiGnPx7LHyod_HN6UwskGAe80yUXHjse9r9R8kXvSxITJfGxFmout0Zp8xQVOqKpcaa9mta70O13B5Bkg0EFsL4iuLcMiI9a-3XgLAP0g1WYYA")' }}
                                >
                                </div>
                                <div className="absolute top-4 right-4 bg-hb-bg-dark/80 backdrop-blur text-hb-gold text-xs font-bold px-3 py-1 rounded-full z-20 border border-hb-gold/20">
                                    RECREATIVO
                                </div>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-hb-bone mb-1 group-hover:text-hb-primary transition-colors">Quincho & Piscina Minimalista</h3>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                Posadas, Misiones
                            </p>
                        </div>
                        {/* Card 4 */}
                        <div className="w-[300px] md:w-[400px] group cursor-pointer pr-10">
                            <div className="h-[250px] md:h-[300px] rounded-xl overflow-hidden mb-4 relative bg-gray-800 flex items-center justify-center border border-gray-700">
                                <div className="text-center p-8">
                                    <span className="material-symbols-outlined text-4xl text-hb-gold mb-4">architecture</span>
                                    <h3 className="text-xl font-serif text-white mb-2">Ver todos los proyectos</h3>
                                    <p className="text-sm text-gray-400">Descubre nuestra trayectoria completa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50 dark:bg-[#0d1a12] px-4 md:px-10">
                <div className="max-w-[1280px] mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-hb-bone">
                            Por qué elegir <span className="text-hb-primary">HB Construcciones</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Cada ladrillo cuenta una historia. Nos dedicamos a crear espacios que perduran en el tiempo, con una estética que enamora.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-[#1c2620] p-8 rounded-xl border border-gray-100 dark:border-[#3c5345] hover:border-hb-gold/50 transition-colors shadow-sm hover:shadow-lg group">
                            <div className="w-12 h-12 bg-hb-primary/10 rounded-full flex items-center justify-center text-hb-primary mb-6 group-hover:bg-hb-primary group-hover:text-hb-bg-dark transition-colors">
                                <span className="material-symbols-outlined">spa</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-hb-bone mb-3">Diseño Orgánico</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                Integramos la naturaleza misionera en cada estructura, utilizando materiales locales y diseños que respetan el entorno.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-white dark:bg-[#1c2620] p-8 rounded-xl border border-gray-100 dark:border-[#3c5345] hover:border-hb-gold/50 transition-colors shadow-sm hover:shadow-lg group">
                            <div className="w-12 h-12 bg-hb-primary/10 rounded-full flex items-center justify-center text-hb-primary mb-6 group-hover:bg-hb-primary group-hover:text-hb-bg-dark transition-colors">
                                <span className="material-symbols-outlined">diamond</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-hb-bone mb-3">Materiales Premium</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                Seleccionamos acabados de alta gama, desde mármoles importados hasta maderas nobles, garantizando durabilidad y lujo.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-[#1c2620] p-8 rounded-xl border border-gray-100 dark:border-[#3c5345] hover:border-hb-gold/50 transition-colors shadow-sm hover:shadow-lg group">
                            <div className="w-12 h-12 bg-hb-primary/10 rounded-full flex items-center justify-center text-hb-primary mb-6 group-hover:bg-hb-primary group-hover:text-hb-bg-dark transition-colors">
                                <span className="material-symbols-outlined">handshake</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-hb-bone mb-3">Atención Personalizada</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                Te acompañamos desde el primer boceto hasta la entrega de llaves. Tu visión es nuestra guía en todo el proceso.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden flex items-center justify-center">
                {/* Dark Overlay Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-hb-bg-dark/90 z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center grayscale opacity-50"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGpgCU5ZsUYjoqTtwh_zYzW-myb9BpKl-2SC7t751vaDVvccgkSZCbGvAaMi1TTx5NCbPOQRH5BelDZK1_ay6vcf_2IeRRfPmnlxXnoLu1thEqkqD6ALRLg8OMycocNHt77Iwxmo7OOUBpGPRPr0pdSv127SjOyGrXBtQ2hJV4dCN9vUbWTNazTd8P3_pSHMWqHV_FUZuWgL5WfDC8VnXfOjRNjI8Es3yfA-ruxNyyXkcAxd2r_I1-a3g4sqYIS7FrcXNjTDtHYJg")' }}
                    >
                    </div>
                </div>
                <div className="relative z-20 text-center max-w-3xl px-6">
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-hb-bone mb-6">
                        ¿Listo para construir su futuro?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 font-light">
                        Solicite una cotización personalizada para su nueva obra en Posadas o el interior de Misiones.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-hb-gold hover:bg-[#c29d2b] text-hb-bg-dark px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl">
                            Cotización de nuevas obras
                        </button>
                        <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-medium transition-all backdrop-blur-sm">
                            Contactar por WhatsApp
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0b1410] text-gray-400 py-12 border-t border-[#1f2b24]">
                <div className="container mx-auto px-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 text-white mb-6">
                                <span className="material-symbols-outlined text-3xl text-hb-primary">domain</span>
                                <span className="font-serif font-bold text-xl">HB Construcciones</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Constructora líder en Posadas, Misiones. Especialistas en arquitectura residencial y comercial de alta gama.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Enlaces</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a className="hover:text-hb-primary transition-colors" href="#">Inicio</a></li>
                                <li><a className="hover:text-hb-primary transition-colors" href="#">Proyectos</a></li>
                                <li><a className="hover:text-hb-primary transition-colors" href="#">Servicios</a></li>
                                <li><a className="hover:text-hb-primary transition-colors" href="#">Contacto</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Contacto</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-base mt-0.5">location_on</span>
                                    <span>Av. Costanera 1234,<br />Posadas, Misiones</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">phone</span>
                                    <span>+54 376 400-0000</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">mail</span>
                                    <span>contacto@hbconstrucciones.com</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Síguenos</h4>
                            <div className="flex gap-4">
                                <a className="w-10 h-10 rounded-full bg-[#1c2620] flex items-center justify-center hover:bg-hb-primary hover:text-hb-bg-dark transition-all" href="#">
                                    <span className="text-xs font-bold">IG</span>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-[#1c2620] flex items-center justify-center hover:bg-hb-primary hover:text-hb-bg-dark transition-all" href="#">
                                    <span className="text-xs font-bold">FB</span>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-[#1c2620] flex items-center justify-center hover:bg-hb-primary hover:text-hb-bg-dark transition-all" href="#">
                                    <span className="text-xs font-bold">LI</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-[#1f2b24] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>© 2024 HB Construcciones S.A. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-white" href="#">Política de Privacidad</a>
                            <a className="hover:text-white" href="#">Términos y Condiciones</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

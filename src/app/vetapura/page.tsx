'use client';

import React, { useState } from 'react';

export default function VetapuraPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-[#e5e5e0] bg-vp-bg-light/90 backdrop-blur-md dark:bg-vp-bg-dark/90 dark:border-white/10 transition-colors duration-300">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-vp-copper flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-lg">chair</span>
                        </div>
                        <span className="font-serif text-2xl font-bold tracking-tight text-vp-text dark:text-white group-hover:text-vp-copper transition-colors">VetaPura</span>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium hover:text-vp-copper dark:text-gray-200 transition-colors" href="#cocinas">Cocinas</a>
                        <a className="text-sm font-medium hover:text-vp-copper dark:text-gray-200 transition-colors" href="#placares">Placares</a>
                        <a className="text-sm font-medium hover:text-vp-copper dark:text-gray-200 transition-colors" href="#banos">Baños</a>
                        <a className="text-sm font-medium hover:text-vp-copper dark:text-gray-200 transition-colors" href="#nosotros">Nosotros</a>
                    </div>
                    {/* CTA */}
                    <div className="hidden md:block">
                        <button className="bg-vp-cta text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-900 transition-colors duration-300 shadow-lg shadow-blue-900/10">
                            Cotizar
                        </button>
                    </div>
                    {/* Mobile Menu Icon */}
                    <button
                        className="md:hidden p-2 text-vp-text dark:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-vp-bg-light dark:bg-vp-bg-dark border-b border-gray-200 dark:border-white/10 p-4 flex flex-col gap-4 shadow-lg">
                        <a className="text-vp-text dark:text-white hover:text-vp-copper font-medium" href="#cocinas">Cocinas</a>
                        <a className="text-vp-text dark:text-white hover:text-vp-copper font-medium" href="#placares">Placares</a>
                        <a className="text-vp-text dark:text-white hover:text-vp-copper font-medium" href="#banos">Baños</a>
                        <a className="text-vp-text dark:text-white hover:text-vp-copper font-medium" href="#nosotros">Nosotros</a>
                        <button className="w-full rounded-full h-10 bg-vp-cta text-white font-bold">Cotizar</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative w-full min-h-[90vh] flex items-center justify-center py-20 px-4 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-vp-sky/30 rounded-l-[100px] -z-10 translate-x-1/4"></div>
                <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text Content */}
                    <div className="flex flex-col gap-8 order-2 lg:order-1 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-vp-copper/30 bg-white/50 w-fit backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-vp-copper"></span>
                            <span className="text-xs font-semibold tracking-wide text-vp-copper uppercase">Colección 2024</span>
                        </div>
                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] font-medium text-vp-text dark:text-white">
                            Diseño exclusivo y artesanía de autor para los <span className="italic text-vp-copper">espacios más exigentes</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed font-light">
                            Mobiliario a medida con una estética orgánica y sofisticada. Transformamos materiales nobles en experiencias habitables únicas e íntimas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button className="bg-vp-cta text-white px-8 py-4 rounded-full text-base font-bold hover:bg-blue-900 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                Cotización de nuevos Diseños
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button className="px-8 py-4 rounded-full text-base font-medium text-vp-text dark:text-white border border-gray-300 hover:border-vp-copper hover:text-vp-copper transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">play_circle</span>
                                Ver Showroom
                            </button>
                        </div>
                    </div>
                    {/* Hero Image Composition */}
                    <div className="relative order-1 lg:order-2 h-[500px] lg:h-[700px] w-full group perspective-1000">
                        {/* Main Image */}
                        <div
                            className="absolute inset-0 rounded-t-full rounded-b-[200px] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.01] bg-cover bg-center"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7M2_dtreuIXexeYrea5PZVfwmtqa91GtOQMvZU-d1KeGZDANUyKOtuJ-1S4NJbM4WDDUDDKZzzQ2ZABYuT8_qszX4dMuE2Lwg_wNHqZofbCe50qPa2sP4y4ndrFr8sUUxjJZQhPtHDItGr15S0NKZSOAVuvf9jkr7proB-XtDyfKSZy2z11YLyEL8cU77kPVfFZSIWiw_4QieH7vPWneZTlrZmSdZiIAKM7EnK7plfd0rR0Mp6DXGWLoBrXiw-mdelwRnwvWiN4g")' }}
                        >
                        </div>
                        {/* Floating Detail Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-[260px] hidden md:block">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-vp-cta">verified</span>
                                <p className="font-bold text-sm dark:text-white">Materiales Certificados</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Utilizamos maderas de fuentes sostenibles y herrajes de última tecnología alemana.</p>
                        </div>
                        {/* Abstract Shape */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[12px] border-vp-primary/40 -z-10 animate-pulse"></div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
                            <div className="w-16 h-16 rounded-full bg-vp-sky/50 flex items-center justify-center mb-6 text-vp-cta">
                                <span className="material-symbols-outlined text-3xl">spa</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-3 dark:text-white">Diseño Orgánico</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Líneas fluidas inspiradas en la naturaleza que suavizan los espacios modernos.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
                            <div className="w-16 h-16 rounded-full bg-vp-copper/20 flex items-center justify-center mb-6 text-vp-copper">
                                <span className="material-symbols-outlined text-3xl">handyman</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-3 dark:text-white">Artesanía de Autor</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Cada pieza es fabricada meticulosamente por maestros carpinteros.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
                            <div className="w-16 h-16 rounded-full bg-vp-primary/20 flex items-center justify-center mb-6 text-yellow-700">
                                <span className="material-symbols-outlined text-3xl">diamond</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-3 dark:text-white">Materiales Nobles</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Selección premium de maderas macizas, mármoles y texturas importadas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Carousel Section (Colecciones) */}
            <section className="py-24 bg-vp-bg-light dark:bg-vp-bg-dark relative overflow-hidden" id="colecciones">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-12 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <span className="text-vp-cta font-bold tracking-widest uppercase text-xs mb-2 block">Portafolio</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-vp-text dark:text-white mb-4">Nuestras Colecciones</h2>
                        <p className="text-gray-600 dark:text-gray-300">Explora nuestras categorías de diseño, donde la funcionalidad se encuentra con el arte.</p>
                    </div>
                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button aria-label="Previous" className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-vp-cta hover:text-white hover:border-vp-cta transition-colors group">
                            <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                        </button>
                        <button aria-label="Next" className="w-12 h-12 rounded-full bg-vp-cta text-white flex items-center justify-center shadow-lg hover:bg-blue-900 transition-colors group">
                            <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
                {/* Scroll Container */}
                <div className="w-full overflow-x-auto pb-12 px-4 md:px-8 no-scrollbar scroll-smooth">
                    <div className="flex gap-6 min-w-max">
                        {/* Card 1: Cocinas */}
                        <article className="group relative w-[300px] md:w-[400px] h-[500px] rounded-lg overflow-hidden cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBg3XEl8XgwMVzgdByae9WY8lI99MpGOVy3acUSQoRTG44yVfifLc_tZJKhqty5FBsshYXM4TtUegWeTAjWeak0sf8--pBsdj1yOiL5mQbmtRF5o0pn9TdbdEZ-0J-mYv5JWD3xSIO5EJB2MvascThLj8R27vEZNMHEKot8H65YdO7fw7QyZgnoisVAcldd5HNt1sG5ENOj350cBqaHbKTbjHpxz8xWJZlURxowTEdWxDIEDUS-HduSgpXyrwKnfWJx0WkPexJ0Ioc")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <p className="text-vp-copper font-medium text-sm mb-2 uppercase tracking-wide">Gourmet</p>
                                <h3 className="text-white font-serif text-3xl mb-4">Cocinas</h3>
                                <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-300">
                                    <span className="text-white/90 text-sm flex items-center gap-2">Ver proyectos <span className="material-symbols-outlined text-sm">arrow_outward</span></span>
                                </div>
                            </div>
                        </article>
                        {/* Card 2: Vestidores */}
                        <article className="group relative w-[300px] md:w-[400px] h-[500px] rounded-lg overflow-hidden cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpAHa2t-264d5_nCs2O_1HRtXviNGVRyQVoItsP9I451KPfv7jL6FeLoDtluqsJxAdiuqeFAzKD2Y5xcE6IewfgbqtSKN1E0E6O_KA0rn-R42yVEzMj_ljyrOynT1CIuD3eUeoVrY7EpKHE8kO8EhWEBlLwPHeM7LweUADLSbypwuSxXjoheiSD78fODEYMtGAkMVHy02nSNzMulnuEoMci9mRE71tCkeHU8zKUDO0qhooQJZcV9fClQnYaz0Kmv2nfVSMadERc8g")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <p className="text-vp-copper font-medium text-sm mb-2 uppercase tracking-wide">Boutique</p>
                                <h3 className="text-white font-serif text-3xl mb-4">Vestidores</h3>
                                <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-300">
                                    <span className="text-white/90 text-sm flex items-center gap-2">Ver proyectos <span className="material-symbols-outlined text-sm">arrow_outward</span></span>
                                </div>
                            </div>
                        </article>
                        {/* Card 3: Baños */}
                        <article className="group relative w-[300px] md:w-[400px] h-[500px] rounded-lg overflow-hidden cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAL9b1QrFuMD1qCb5NcmnKrPQBUj4pf2bUHopbIyrBjZzK4VUvvpyBaCeSCHbigPnJccY71AlTzo9QatPw0kfPpl20fqekCngBeeKlO2tgVeN1RhQVX6mSVAL5CfufJ-kCfNdJ6cQ1KHbmepQdGoy1DUy0VDHC9VTnKk37RVI0u-MubR1fPac-a4Y6-KMs8VwVo4dpZhdJJdWav0BhUxcLJbSe_luwXFfXn3NrY8u7e-2FliQvl4FRK7UDmLDSZVvtc41PLrleA214")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <p className="text-vp-copper font-medium text-sm mb-2 uppercase tracking-wide">Spa & Wellness</p>
                                <h3 className="text-white font-serif text-3xl mb-4">Baños</h3>
                                <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-300">
                                    <span className="text-white/90 text-sm flex items-center gap-2">Ver proyectos <span className="material-symbols-outlined text-sm">arrow_outward</span></span>
                                </div>
                            </div>
                        </article>
                        {/* Card 4: Placares */}
                        <article className="group relative w-[300px] md:w-[400px] h-[500px] rounded-lg overflow-hidden cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDf5AY_uA-ZWfiYaHSlEwAgTrIdHkFgPp9m6Alv_HqoDS1DXNbop6KlaJGJVH2pnQ1YpGw2c2E6mMBfx4jHBKze7CPl2OyMY92wRCS5W1xgj-gBKGjFLDocVv3l9mT-BPmaZDGFbMfm5boIhCBgbpdT7pMXW0Bqz-HB0YXqTpgyMNUVHnZ9JgSC6T2Nzdc7RCmJddRId6fKqAkkEP1uj3ft-2DAYyihkhOtBpGw2NdycToWH5Ws-rPtNJRUD3WYxkFIL4jkN5lTSUo")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <p className="text-vp-copper font-medium text-sm mb-2 uppercase tracking-wide">Inteligentes</p>
                                <h3 className="text-white font-serif text-3xl mb-4">Placares</h3>
                                <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-300">
                                    <span className="text-white/90 text-sm flex items-center gap-2">Ver proyectos <span className="material-symbols-outlined text-sm">arrow_outward</span></span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Detailed Feature Split Section */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2 relative">
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHpjtU0jBZNSe9ohMFHuSp8l9fYOEU9KGALU1sqa3_EjhJ5AQ30IPpCi3Sey8bz0Or__PQjNks2ZwaJ3i5flvBxwFrlYT61Mo0yVFG7MWFk-_2WX93vEshNpETR8Ppazixn_t0NF1eijkqQvl_7IWPrwWS8Es4_zQ1KmHiMH0F7JYSK269zB1kB__aVSf_WZOmQshG-cqDFsFKlP1u0fMV6wokYfdmz-nXaS7ygulyQ0RGxPZiLhfBQ1dUcYDR-UcA7v14z-YOy2g")' }}
                                >
                                </div>
                            </div>
                            {/* Decorative floating element */}
                            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-vp-sky/20 rounded-full blur-2xl -z-10"></div>
                        </div>
                        <div className="w-full lg:w-1/2 flex flex-col gap-8">
                            <h2 className="font-serif text-4xl md:text-5xl text-vp-text dark:text-white leading-tight">
                                La esencia <span className="text-vp-copper italic">VetaPura</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Creamos atmósferas íntimas y minimalistas donde cada detalle cuenta. No solo fabricamos muebles, diseñamos el escenario de tu vida cotidiana.
                            </p>
                            <ul className="space-y-6 mt-4">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-vp-primary/40 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-sm text-black">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-white">Personalización Total</h4>
                                        <p className="text-gray-500 dark:text-gray-400">Adaptamos cada centímetro a tus necesidades específicas.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-vp-primary/40 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-sm text-black">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-white">Durabilidad Garantizada</h4>
                                        <p className="text-gray-500 dark:text-gray-400">Materiales seleccionados para perdurar generaciones.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-vp-primary/40 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-sm text-black">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-white">Instalación Premium</h4>
                                        <p className="text-gray-500 dark:text-gray-400">Equipo especializado que cuida tu hogar durante el montaje.</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="pt-6">
                                <a className="text-vp-cta font-bold hover:underline flex items-center gap-2" href="#">
                                    Conoce nuestro proceso
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials / Quote */}
            <section className="py-24 bg-vp-sky/10 border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="material-symbols-outlined text-6xl text-vp-copper/20 mb-6">format_quote</span>
                    <p className="font-serif text-2xl md:text-4xl italic text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
                        "VetaPura transformó nuestra cocina en el corazón de la casa. La atención al detalle y la calidez de la madera cambiaron por completo cómo vivimos el espacio."
                    </p>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden">
                            <img alt="Portrait of happy client" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGgoRjBpOspgMls7822zKdk5H-T0DR8CGzXMbZOa5pJ4UZgIdzeqOqK4okRi3z0_1-1_uNyxW_wpLH9MoghpO4onL9BW5EUpPR4c8FkRhWsXHonz1eXc28P18kQnsfUktj6O4xWV7mz4gbEZ8QYoBePCBIBfn77o89iXZJdK1KlLurAkTboxgTOfoFdqUSh6TMRCyRFF2MYqk8B_RiSuVlRNUhjk2FLApHoIc0Y8qBSjcKCdUbAYaR4ZsY-b-ycp8pw-5w_qEbI0c" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-vp-text dark:text-white">Maximiliano Puerta</p>
                            <p className="text-sm text-gray-500 uppercase tracking-widest">Arquitecto</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-vp-bg-light dark:bg-vp-bg-dark">
                <div className="max-w-[1280px] mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                    {/* Background Blob */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-vp-sky/40 via-transparent to-transparent"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="font-serif text-4xl md:text-5xl text-vp-text dark:text-white mb-6">¿Listo para transformar tu espacio?</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                            Agenda una cita con nuestros diseñadores y comencemos a dar vida a tus ideas con una propuesta personalizada.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto bg-vp-cta text-white px-10 py-4 rounded-full text-base font-bold hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20">
                                Cotización de nuevos Diseños
                            </button>
                            <button className="w-full sm:w-auto px-10 py-4 rounded-full text-base font-medium text-vp-text dark:text-white border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Descargar Catálogo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-vp-copper flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-xs">chair</span>
                                </div>
                                <span className="font-serif text-xl font-bold text-vp-text dark:text-white">VetaPura</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                Diseño y fabricación de mobiliario a medida. Calidad, estética y funcionalidad en cada detalle.
                            </p>
                        </div>
                        {/* Links */}
                        <div>
                            <h4 className="font-bold text-vp-text dark:text-white mb-4">Explorar</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a className="hover:text-vp-cta transition-colors" href="#">Cocinas</a></li>
                                <li><a className="hover:text-vp-cta transition-colors" href="#">Vestidores</a></li>
                                <li><a className="hover:text-vp-cta transition-colors" href="#">Baños</a></li>
                                <li><a className="hover:text-vp-cta transition-colors" href="#">Proyectos Comerciales</a></li>
                            </ul>
                        </div>
                        {/* Contact */}
                        <div>
                            <h4 className="font-bold text-vp-text dark:text-white mb-4">Contacto</h4>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    Av. Libertador 2400, Buenos Aires
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                    contacto@vetapura.com
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">call</span>
                                    +54 11 4567 8901
                                </li>
                            </ul>
                        </div>
                        {/* Social */}
                        <div>
                            <h4 className="font-bold text-vp-text dark:text-white mb-4">Síguenos</h4>
                            <div className="flex gap-4">
                                <a className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-vp-cta hover:text-white transition-colors" href="#">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-vp-cta hover:text-white transition-colors" href="#">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                        <p>© 2024 VetaPura. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-vp-text dark:hover:text-white transition-colors" href="#">Privacidad</a>
                            <a className="hover:text-vp-text dark:hover:text-white transition-colors" href="#">Términos</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

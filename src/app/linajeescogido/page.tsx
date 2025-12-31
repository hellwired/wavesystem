'use client';

import React, { useState } from 'react';

export default function LinajeEscogidoPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full bg-[#221d10]/95 backdrop-blur-sm border-b border-le-brown-deep">
                <div className="px-4 md:px-10 py-4 flex items-center justify-between max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-le-primary text-3xl">crown</span>
                        <h1 className="text-white text-xl md:text-2xl font-serif font-bold tracking-tight">LE♕LINAJE ESCOGIDO</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium text-white hover:text-le-primary transition-colors" href="#">Colección</a>
                        <a className="text-sm font-medium text-white hover:text-le-primary transition-colors" href="#">Formal</a>
                        <a className="text-sm font-medium text-white hover:text-le-primary transition-colors" href="#">Casual</a>
                        <a className="text-sm font-medium text-white hover:text-le-primary transition-colors" href="#">Contacto</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="text-white hover:text-le-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="text-white hover:text-le-primary transition-colors">
                            <span className="material-symbols-outlined">shopping_bag</span>
                        </button>
                        <button
                            className="text-white hover:text-le-primary transition-colors md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-[#221d10] border-t border-le-brown-deep absolute w-full left-0 p-4 flex flex-col gap-4 shadow-lg">
                        <a className="text-white hover:text-le-primary font-medium" href="#">Colección</a>
                        <a className="text-white hover:text-le-primary font-medium" href="#">Formal</a>
                        <a className="text-white hover:text-le-primary font-medium" href="#">Casual</a>
                        <a className="text-white hover:text-le-primary font-medium" href="#">Contacto</a>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <div className="relative min-h-[600px] md:min-h-[700px] w-full flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-le-brown-deep/40 to-transparent z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3cM4WZwjNuoR-DNfLn_VUkcCIry14xkjO6q3hw0Q3w_kdLeUcAoZzPzSOn-wTEWXrNPImFYL_BXy5MBsClBJ7kZwcT8onfEF29boPb-fJqIKJ2fzwjdlfr947uAdxHk9IX801UIZWmSfRyuwB5XsRhxKtWytpF5lDA8zEQ1tm1Kb6WJUSzrClMFbiSS73Sh4o8yU9WHUlk_I2ByLnuQfI8TBTo_TSpCS3buJSKA56JWtHCoDxZp3mZqjaprPDc3qel2ozOpmrjeE")' }}
                    >
                    </div>
                </div>
                <div className="relative z-20 container mx-auto px-4 text-center max-w-4xl">
                    <div className="inline-block mb-4 px-3 py-1 border border-le-accent-light-pink/30 rounded-full bg-le-brown-deep/60 backdrop-blur-sm">
                        <span className="text-xs uppercase tracking-widest text-le-accent-light-pink font-semibold">Colección 2025</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-6 leading-tight drop-shadow-lg">
                        Elegancia Digna de la <span className="text-le-primary italic">Realeza</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
                        Moda femenina diseñada para la mujer que conoce su valor. Descubre piezas exclusivas que fusionan la sofisticación moderna con la belleza clásica.
                    </p>
                    <button className="bg-le-primary hover:bg-le-primary-hover text-[#221d10] font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(236,183,24,0.3)] text-base uppercase tracking-wide">
                        Realiza tu Pedido
                    </button>
                </div>
            </div>

            {/* Features / Collections */}
            <section className="py-20 px-4 bg-le-bg-dark relative overflow-hidden">
                {/* Decorative organic shape */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-le-brown-deep rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/4"></div>
                <div className="max-w-[1200px] mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">Nuestras Colecciones</h2>
                            <p className="text-gray-400 font-light max-w-md">Explora diseños exclusivos curados para resaltar tu belleza natural y sofisticación en cada momento.</p>
                        </div>
                        <a className="text-le-accent-pink hover:text-white transition-colors flex items-center gap-2 group" href="#">
                            Ver todo el catálogo
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD53RrdGxWpK8K_k8zfqJALWd0-V2YQJLYlMZXldGSipVXwkmN0On49P7eiDEZbRFRYkjGtyAhpOclYaKOqryunUoWQQIz63NuZesNDFKBREuHd_NO24BouDwYXQN76oGKm8uSAkbWXi64P8hCS1akiK49kvQarQ9S_Pt1f9asJUlwuCTv7YofuD5aLTTB9nW52mFcGjB5sqQEtVuffDWghcRHRkKppd0vEVCQtPtGEhkSjClDgp8HT8QbxznqpjG1hd2yOND1JBv4")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <span className="text-le-accent-pink text-xs font-bold uppercase tracking-wider mb-2 block">Exclusivo</span>
                                <h3 className="text-2xl font-serif text-white mb-1">Moda Formal</h3>
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Vestidos de gala y trajes de noche para eventos inolvidables.</p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBT3pcuP8v5MLdGZgPhJxc8iq4MvfhzxAbONmNh8Urwu4dBtKSTs5ZYGPoOB_HFi08YvUKceX03HkgzMS_mOrqqHoIx8KHytrP_BcLCQLA0ULhMkE5mQUZS6uixRT_BYJPilyj6HS0--atS7TuRf3lUfJV8qYg_w2I2VnaXym5NtjStiMXmQRQyVQXfk9G3PHim_zVct5bRHU9L3KqV7ZjsqmEphnpktk_eUY75PJgqS-_2QINvTKGXZ_uSIGVGfKRIKTYxTtNY578")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <span className="text-le-primary text-xs font-bold uppercase tracking-wider mb-2 block">Tendencia</span>
                                <h3 className="text-2xl font-serif text-white mb-1">Estilo Casual</h3>
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Elegancia relajada para tu día a día con un toque real.</p>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4PdxI0rP0CgSgbPyyKej3yMDRTGHVoFaa2PJ8AD3Q5r3kIcyhg_yvRejf6PuW2tS0v7Hf30gQTbMeYWKFt-gUZw5pU78UcVFtCDhkMlA7oVC1Z5Ods5-LWoUwxsaNmt5mASAyQqeAxUSwGed9txa26QHhYtNxYn-PhFyesQnEnPaHSd0kcXDfg8mdIm3RIhQud7YqxT4R7djVeTHq_fnDU1zcWaRHVxJieKIV6Zk1fi-Tof70nVXD5ilTw4DV_75TxbCLpDEznP8")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <span className="text-white text-xs font-bold uppercase tracking-wider mb-2 block">Nueva Temporada</span>
                                <h3 className="text-2xl font-serif text-white mb-1">Visión 2025</h3>
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Adelántate al futuro con cortes y texturas innovadoras.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Carousel Section */}
            <section className="py-20 bg-le-brown-deep relative">
                <div className="px-4 md:px-10 max-w-[1440px] mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-serif text-white">Favoritos del Linaje</h2>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-le-primary/30 flex items-center justify-center text-le-primary hover:bg-le-primary hover:text-le-brown-deep transition-all">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                            </button>
                            <button className="w-10 h-10 rounded-full border border-le-primary/30 flex items-center justify-center text-le-primary hover:bg-le-primary hover:text-le-brown-deep transition-all">
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    {/* Carousel Container */}
                    <div className="flex overflow-x-auto no-scrollbar gap-6 pb-8 snap-x snap-mandatory">
                        {/* Product 1 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-[#221d10] rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-black/40 transition-shadow">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqNmHUAtjsfDAWakSK-IYFi2HIwnivn8iup5rY6dSU65GCO1TNJbOtdiGMv6dSPSWcz63dm9CIkXITU0KNtwLQVZSbTnppT7LuhxRiGlSYl-wHMucR6osH5WvknDEei8alNHK_WPpXtjrMLcjJdS4lExer4veMpYAH6lDDYL54EfWLgH2BH9n0h43yP3QRYD85Sxz5YghlGgZwv8KlZFWSPf9lRoNnT5YxAzv73hpqIndroSgTyjTGtHX9KEA4vSeFnZQVZ4zl5mg")' }}
                                >
                                </div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-le-accent-pink hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                                </button>
                                <div className="absolute bottom-3 right-3">
                                    <button className="bg-le-primary text-[#221d10] p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-serif text-lg text-white mb-1">Vestido Imperial Seda</h3>
                                <p className="text-sm text-gray-400 mb-3">Seda 100% natural, corte A</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-le-primary">$280.00</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#F5F5DC]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Product 2 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-[#221d10] rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-black/40 transition-shadow">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCzneD73c4N84cM2SpAVudLHqTkassidbtnUjuGP2egDAEUjgc_NSv2uANJqqFGwjdtYBTKV_etxIAl9Il4liUXQCFHSC_ltVV4AtlL55BKw8998FY20uUz492hwuSgiDpBQkXZ9EJAgQA3HjeoZ_b_xNugoFicwSoOEoR0EjRVOLCUTW7wxpRbx4QiGoEEyqhR7h9pkZKR0VwgMP8y6U6uZ0Z9uwMHBRqjDxzePRMZloE-Rg8wy4hxGsCnj0kB12amB0P_UoBDklw")' }}
                                >
                                </div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-le-accent-pink hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                                </button>
                                <div className="absolute bottom-3 right-3">
                                    <button className="bg-le-primary text-[#221d10] p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-serif text-lg text-white mb-1">Blazer Soberana</h3>
                                <p className="text-sm text-gray-400 mb-3">Elegancia para la oficina</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-le-primary">$195.00</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Product 3 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-[#221d10] rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-black/40 transition-shadow">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACNJgWZuugPyefb3pLODGJYLDOh7XY-MCzmdBlehKGNGfy4Y695rwjIQm2gngUQeIhl6LvK6Y5SPsSvsQwJ8kt_cE4GriOAwBjbPT3Y21Al1fBIFDJVOjAbSWe8T1q28hMv_CMw4OCudTWNc8JDHMTNg9ltpyX3548-evmL-BpQQWexzZWDcnNXEVla4lfHcuOPWkrG15nvkaK7byiCQR7kE15yvyVX8e5DH3oQH3-wxLl3sMnsQftlPUZ7NOZtS8boudFmSmRYxc")' }}
                                >
                                </div>
                                <span className="absolute top-3 left-3 bg-le-accent-pink text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">Nuevo</span>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-le-accent-pink hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                                </button>
                                <div className="absolute bottom-3 right-3">
                                    <button className="bg-le-primary text-[#221d10] p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-serif text-lg text-white mb-1">Vestido Flora Real</h3>
                                <p className="text-sm text-gray-400 mb-3">Estampado floral delicado</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-le-primary">$145.00</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#FF4D6D]"></div>
                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Product 4 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-[#221d10] rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-black/40 transition-shadow">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCT-CH2DokBwdAFsjc8BbWApL7olxk9HGlpR7WfRQM0qkHRoiYgusZ8JrLmk0HNu7Uol5WzIFeDOQ05zJsl_Z8s0nhQRd-i6DVgYaW7vC7R4TALpp5VV2DgfYkMqSBAAvqdR38bDQEJftuOYgvCt0LLkTUqtxeypOQPKpxcH74O9B7IzO4V-83GgCoevKNHQMAW5Puatt08hpnHFaOS_jG1CXTaCzKkzcjmRlapsmFJf59uNdM4ZOo5YpqB8YT4CXD9jlespFWIqM")' }}
                                >
                                </div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-le-accent-pink hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                                </button>
                                <div className="absolute bottom-3 right-3">
                                    <button className="bg-le-primary text-[#221d10] p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-serif text-lg text-white mb-1">Conjunto Palazzo</h3>
                                <p className="text-sm text-gray-400 mb-3">Comodidad y lujo en uno</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-le-primary">$210.00</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intimate/Organic Text Section */}
            <section className="py-24 px-4 bg-le-bg-dark text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-le-accent-light-pink rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
                <div className="max-w-2xl mx-auto relative z-10">
                    <span className="material-symbols-outlined text-4xl text-le-primary mb-6">diamond</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-snug">"La verdadera elegancia no es ser notada, sino ser recordada."</h2>
                    <p className="text-le-accent-light-pink font-medium tracking-wide uppercase text-sm">El manifiesto del linaje</p>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 px-4 bg-[#2a2416] border-t border-le-brown-deep">
                <div className="max-w-4xl mx-auto bg-le-brown-deep rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-le-primary rounded-full mix-blend-overlay filter blur-[80px] opacity-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-serif text-white mb-3">Únete al Linaje</h2>
                            <p className="text-gray-300 mb-6">Suscríbete para recibir acceso anticipado a nuestras colecciones exclusivas, invitaciones a eventos privados y un 10% de descuento en tu primera orden real.</p>
                        </div>
                        <div className="flex-1 w-full max-w-sm">
                            <form className="flex flex-col gap-3">
                                <input className="w-full h-12 rounded-lg bg-[#221d10] border border-[#5c4033] text-white px-4 focus:ring-1 focus:ring-le-primary focus:border-le-primary placeholder-gray-500 outline-none transition-all" placeholder="Tu correo electrónico" type="email" />
                                <button className="w-full h-12 bg-le-primary hover:bg-le-primary-hover text-[#221d10] font-bold rounded-lg transition-colors uppercase tracking-wider text-sm" type="button">
                                    Suscribirse
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-4 text-center">Respetamos tu privacidad. Date de baja en cualquier momento.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-le-bg-dark py-12 px-4 border-t border-le-brown-deep">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-white font-serif font-bold text-lg tracking-widest">LE♕LINAJE ESCOGIDO</span>
                        <span className="text-gray-500 text-sm">© 2025 Todos los derechos reservados.</span>
                    </div>
                    <div className="flex gap-6">
                        <a className="text-gray-400 hover:text-le-primary transition-colors" href="#"><span className="sr-only">Instagram</span>IG</a>
                        <a className="text-gray-400 hover:text-le-primary transition-colors" href="#"><span className="sr-only">Facebook</span>FB</a>
                        <a className="text-gray-400 hover:text-le-primary transition-colors" href="#"><span className="sr-only">Pinterest</span>PT</a>
                    </div>
                </div>
            </footer>
        </>
    );
}

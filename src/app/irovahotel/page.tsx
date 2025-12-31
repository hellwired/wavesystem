'use client';

import React, { useState } from 'react';

export default function IrovaHotelPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            {/* Navigation */}
            <header className="fixed top-0 z-50 w-full bg-white/90 dark:bg-irova-bg-dark/90 backdrop-blur-md border-b border-[#f5f5f0] dark:border-[#3a392a] transition-colors duration-300">
                <div className="flex items-center justify-between px-6 py-4 lg:px-20 max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="size-8 text-forest-green dark:text-irova-primary">
                            <span className="material-symbols-outlined !text-3xl">spa</span>
                        </div>
                        <h2 className="text-forest-green dark:text-white text-xl lg:text-2xl font-serif font-bold tracking-tight">Irova Hotel</h2>
                    </div>
                    <nav className="hidden lg:flex items-center gap-8">
                        <a className="text-forest-green/80 dark:text-white/80 hover:text-forest-green dark:hover:text-irova-primary text-sm font-medium transition-colors" href="#">Inicio</a>
                        <a className="text-forest-green/80 dark:text-white/80 hover:text-forest-green dark:hover:text-irova-primary text-sm font-medium transition-colors" href="#">Habitaciones</a>
                        <a className="text-forest-green/80 dark:text-white/80 hover:text-forest-green dark:hover:text-irova-primary text-sm font-medium transition-colors" href="#">Gastronomía</a>
                        <a className="text-forest-green/80 dark:text-white/80 hover:text-forest-green dark:hover:text-irova-primary text-sm font-medium transition-colors" href="#">Servicios</a>
                        <a className="text-forest-green/80 dark:text-white/80 hover:text-forest-green dark:hover:text-irova-primary text-sm font-medium transition-colors" href="#">Contacto</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="hidden lg:flex items-center justify-center rounded-full h-10 px-6 bg-irova-primary hover:bg-irova-primary/90 text-irova-bg-dark text-sm font-bold tracking-wide transition-all shadow-lg shadow-irova-primary/20">
                            Reservar
                        </button>
                        {/* Mobile Menu Icon */}
                        <button
                            className="lg:hidden text-forest-green dark:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-irova-bg-dark border-b border-[#f5f5f0] dark:border-[#3a392a] p-4 flex flex-col gap-4 shadow-lg">
                        <a className="text-forest-green dark:text-white hover:text-irova-primary font-medium" href="#">Inicio</a>
                        <a className="text-forest-green dark:text-white hover:text-irova-primary font-medium" href="#">Habitaciones</a>
                        <a className="text-forest-green dark:text-white hover:text-irova-primary font-medium" href="#">Gastronomía</a>
                        <a className="text-forest-green dark:text-white hover:text-irova-primary font-medium" href="#">Servicios</a>
                        <a className="text-forest-green dark:text-white hover:text-irova-primary font-medium" href="#">Contacto</a>
                        <button className="w-full rounded-full h-10 bg-irova-primary text-irova-bg-dark font-bold">Reservar</button>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <div className="relative pt-20 lg:pt-0 min-h-[90vh] flex items-center justify-center px-4 lg:px-20">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-irova-bg-light dark:to-irova-bg-dark z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center object-cover animate-fade-in"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMu6FFaZBpYitvZfBd2nr1qi_GwnWkLOzBWUz_R48Oee2-JY7FcF1sma2Ydh_-9D4BWk2Gc1I7Xj86VOkZselE3O1V2gyQpcAq--e-24JbJ5MEBS_m1P25Zirn-sCMccjIGxidk-GfjM6Dka44W5Zw53pW9j6VO3zvi0uJB6q1nz0yMod6RuGtSwf_jcurdFqe5OLw8QfK299hIoNPYB6yA6aXbHepylDBvxPlJcjUoywvPSk-Bx_yFk5Tw1LRousaKOt_A98gxnM")' }}
                    >
                    </div>
                </div>
                <div className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-6 animate-slide-up mt-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-wider mb-2">
                        Posadas, Misiones
                    </span>
                    <h1 className="text-white text-5xl lg:text-7xl font-serif font-bold leading-tight drop-shadow-sm">
                        Donde la Alta Cocina <br /><span className="text-irova-primary italic">Misionera Florece</span>
                    </h1>
                    <p className="text-white/90 text-lg lg:text-xl max-w-2xl font-light leading-relaxed drop-shadow-sm">
                        Un refugio de lujo orgánico donde la naturaleza abraza la sofisticación. Descubra la esencia de la tierra colorada.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                        <button className="flex items-center justify-center rounded-full h-14 px-8 bg-irova-primary hover:bg-[#e6e205] text-irova-bg-dark text-base font-bold tracking-wide transition-all shadow-xl hover:scale-105">
                            Reservar en el Hotel
                        </button>
                        <button className="flex items-center justify-center rounded-full h-14 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white text-base font-medium tracking-wide transition-all">
                            Explorar Menú
                        </button>
                    </div>
                </div>
            </div>

            {/* Section: Intro Quote */}
            <div className="py-20 px-6 lg:px-20 bg-irova-bg-light dark:bg-irova-bg-dark">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="material-symbols-outlined text-4xl text-gold-accent mb-6">format_quote</span>
                    <p className="text-2xl lg:text-3xl font-serif text-forest-green dark:text-white leading-relaxed italic">
                        "Cada detalle en Irova está diseñado para conectar con el entorno, desde la arquitectura que respira hasta los sabores que cuentan historias."
                    </p>
                </div>
            </div>

            {/* Carousel: Spaces */}
            <section className="py-12 lg:py-20 px-4 lg:px-0 overflow-hidden bg-white dark:bg-white/5">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20 mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="text-forest-green dark:text-white text-3xl lg:text-4xl font-serif font-bold mb-3">Nuestros Espacios</h2>
                        <p className="text-forest-green/70 dark:text-white/60 text-base max-w-md">Diseñados para el descanso, la inspiración y el deleite de los sentidos.</p>
                    </div>
                    <div className="hidden lg:flex gap-2">
                        <button className="size-10 rounded-full border border-forest-green/20 dark:border-white/20 flex items-center justify-center text-forest-green dark:text-white hover:bg-forest-green/5 dark:hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button className="size-10 rounded-full bg-forest-green dark:bg-irova-primary text-white dark:text-irova-bg-dark flex items-center justify-center hover:bg-forest-green/90 dark:hover:bg-irova-primary/90 transition-colors">
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 lg:px-20 pb-8 gap-6">
                    {/* Card 1 */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[400px] flex flex-col group cursor-pointer">
                        <div className="relative h-[300px] sm:h-[450px] overflow-hidden rounded-xl mb-6">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAI-zzQpNSgQcRh-IixtsdnNj77DGGIT4CC59kn-69HyOCh_6XbZG57V1mASri72d_I95_rAh-tgzT1ePf6GOMkpRP-24pkF_FI_Dfiiy44E7KOlOzhKuP30JLegH17aQLFFc0VKAWvfEbe7aDOrdXCwf3oTUiBl8EADBkOUm3R76KreHMMqzz30gZLkpD9H4b9q3ApZOR_ZrZrWWCWqJE5xK_jcUNb_BsUak2Fr7yGrzPBFCRNGxO8KODxEBnYHzanItQYffg_fCQ")' }}
                            >
                            </div>
                            <div className="absolute bottom-4 right-4 z-20 bg-white/90 dark:bg-irova-bg-dark/90 backdrop-blur rounded-full p-2">
                                <span className="material-symbols-outlined text-forest-green dark:text-irova-primary">pool</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-forest-green dark:text-white text-2xl font-serif font-bold mb-1">Piscina Infinita</h3>
                            <p className="text-forest-green/60 dark:text-white/60 text-sm">Relájate bajo el sol misionero con vistas a la selva.</p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[400px] flex flex-col group cursor-pointer">
                        <div className="relative h-[300px] sm:h-[450px] overflow-hidden rounded-xl mb-6">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKD54poknQfzFzfhsSYcGnmdyqtcQBMPdUipZnDLKrg_K_tNe7CalTWIElYgMP7cDuTIY7b7cii53Z_Ks_ztzoCxmRpDaJut9MJEAh4O5YggHgZ8Okmm0ZmLsmRDyaVudGzb5l-jyqUnOidREJJWDeYW831XU8y9Ad_bZLewNf0CN7EawNuljLb-5j_Z6g6xOS1suEdwCzUOsGa8xOelBfbuOqJK71Y2y4vnr_3EdLwJP8OaVTq7Q7MY2h9pEAKUIOsbfBbUqmfeU")' }}
                            >
                            </div>
                            <div className="absolute bottom-4 right-4 z-20 bg-white/90 dark:bg-irova-bg-dark/90 backdrop-blur rounded-full p-2">
                                <span className="material-symbols-outlined text-forest-green dark:text-irova-primary">restaurant</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-forest-green dark:text-white text-2xl font-serif font-bold mb-1">Restaurante Gourmet</h3>
                            <p className="text-forest-green/60 dark:text-white/60 text-sm">Sabores autóctonos re-imaginados con técnicas modernas.</p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[400px] flex flex-col group cursor-pointer">
                        <div className="relative h-[300px] sm:h-[450px] overflow-hidden rounded-xl mb-6">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCExf1JJ2TojygvkISOzLpOjkoedJXXybVWUWvzLNv9-BeSFUJmIEe_wg-AyjpsFWh-EFceXnn2dn8PvMpEWPlTMh_oUAYDCyJU5VZYRCNjPhdAK8m5chgQN6QEqyePKAT6vPuxXG5lgXKi4AVV_c8VpD-dSThJuIig6YW2tBq2fG1pzO1cEvpcOC8DO7Y8KCLzZvnHADnpUTAc3zUEg7soPxjgX3ri25UZxkDM7WOnA6EU6MVFbgLqaCfWBAhEYWSwDUAd4UygLPE")' }}
                            >
                            </div>
                            <div className="absolute bottom-4 right-4 z-20 bg-white/90 dark:bg-irova-bg-dark/90 backdrop-blur rounded-full p-2">
                                <span className="material-symbols-outlined text-forest-green dark:text-irova-primary">wifi</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-forest-green dark:text-white text-2xl font-serif font-bold mb-1">Zona Conectada</h3>
                            <p className="text-forest-green/60 dark:text-white/60 text-sm">Espacios de co-working integrados en la naturaleza.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Gastronomy Highlights */}
            <section className="py-20 px-6 lg:px-20 bg-irova-bg-light dark:bg-irova-bg-dark">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="flex-1 space-y-8 order-2 lg:order-1">
                            <div>
                                <span className="text-gold-accent font-bold tracking-widest text-sm uppercase mb-2 block">Gastronomía de Autor</span>
                                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green dark:text-white leading-tight mb-4">
                                    Sabores de la <br /> Tierra Colorada
                                </h2>
                                <p className="text-forest-green/70 dark:text-white/70 text-lg leading-relaxed">
                                    Nuestra cocina celebra la biodiversidad de Misiones. Utilizamos ingredientes frescos de productores locales: mandioca, pacú, yerba mate y frutas tropicales, transformados en experiencias culinarias inolvidables.
                                </p>
                            </div>
                            {/* Featured Dishes List */}
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/10">
                                    <div
                                        className="size-16 rounded-full bg-cover shrink-0"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBu72NhxUPqSPumXV5kZU0dhpWETcnQ9RItxvI65wckpjW5xpQaOy1-ylHp_vtKbMqZtO2JgMifM7apPHm6_X5HnXWllEg2gUfALA_26uZqa0lEidr3FKlfFKfZzVd-jvxBwXYjvqFVBi1gZ1jKLRDHosnt7MMfZyV_ZEQx3inp2NxAe8_-zsXWleal95iNghisX-6DcGrPCgvR_61kWWO5cLnNCDDeJuODLFaITg5CDZngV1c_CuMoeP7Md5nMg-QT9crb-Uv6tm0")' }}
                                    ></div>
                                    <div>
                                        <h4 className="text-xl font-serif font-bold text-forest-green dark:text-white">Pacú a la Parrilla</h4>
                                        <p className="text-sm text-forest-green/60 dark:text-white/60">Con costra de cítricos y puré rústico de mandioca.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/10">
                                    <div
                                        className="size-16 rounded-full bg-cover shrink-0"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwzmQ8YP1ja_pljF4TskeHWM2PvmFiteJ6gHvgDBwcR2_9uYH50J8TC7X44wfWY10FlUBAJMQ66i_VU8WARyS6Pe4ANY78b6xZBpZzYLwSsMihXfTTQ7XPtuIRXvJWkcYSDuhG1fp17e2TO6gMNBt-AKa6hvtjOnG6g7V3LRZzw2j713iNMspD_rXqEiyP1TZZyvadWQOWhIXpIU4Cm0UQDqLebQ-xaWYw-DmUucblx0Yh-pEK_xh2Cs3jT436mDAvutKr2WZJ5Nc")' }}
                                    ></div>
                                    <div>
                                        <h4 className="text-xl font-serif font-bold text-forest-green dark:text-white">Mousse de Yerba Mate</h4>
                                        <p className="text-sm text-forest-green/60 dark:text-white/60">Dulce de leche artesanal y crocante de nueces.</p>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-4 flex items-center gap-2 text-forest-green dark:text-irova-primary font-bold hover:underline underline-offset-4">
                                Ver Menú Completo <span className="material-symbols-outlined text-sm">arrow_outward</span>
                            </button>
                        </div>
                        {/* Image Grid */}
                        <div className="flex-1 grid grid-cols-2 gap-4 order-1 lg:order-2 h-[500px]">
                            <div
                                className="h-full rounded-tl-xl rounded-bl-xl bg-cover bg-center"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACMDvKSlJWEh1dUPrVoj_cBKFXxivmhr9V9yFvVYMlxTuObSNAMETqdGR-NyZgvy6gB-HAz7wwArl47mYaMzme3H74TP_0U2YawozZjq5EY5HejWm5TycUk1KqCZUIbdnckK0DsyPsUrOAoHZnL_yUk2BsmzG2XjhshrIeVZt67QoJNQdhxge5iCmRITpMGh55Mb9bfu7xpJGEkGG-arQkWI8yRkzxVtmr6deRxiuerEo49YM9PS9_yRj7IaoeTr1fUFOxt588hoY")' }}
                            ></div>
                            <div className="flex flex-col gap-4 h-full">
                                <div
                                    className="flex-1 rounded-tr-xl bg-cover bg-center"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCERldTnhuAy0AqJK-QQr5VVEmOGcvfRhHqdrFfBUS21j4_PHa915O5bdImOIqomizHvavLoasxjItHf3-EwuJYWS0YOUUnX3iaMNq04Ng7aDBiCfRMsDp_P3hU6Wp-h02x35kFbalalQiCNv_HC4xIqtRKnMoAihMa6iycqwYkBUj3ktzNCeYjcAh8fFwpLOO9Ww7A5-67--lGqhc1U6v7FhB-MEQl3KevIdGiJF1oBBoqzdgX9aewmYj2cDdaAd0E_BBqdRhFdy8")' }}
                                ></div>
                                <div
                                    className="flex-1 rounded-br-xl bg-cover bg-center"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0W1_tl39RJuY9RaoIuVhUIX49TkRHdGNzVE2K-2C6pT4T1R1hRbWpmXGk_m-aiWM8byaz8bSEySmoc-s2SxWtW90Qa21oAPWIWYW2o8M_taNdRc0q67HGoUv62BrJrMeY-23HphYND0mBdxjebHSecE41pcLpw2WYHVvEQF9UZ4uMhBAsjIdlEo6SGQLzk3MeJjzecAuxKbjWIBAwsNR-H_ynXyJaGkmE5DKl0tAg8laH62zHDtnzA6paVXcDC6UVtTghcpCKLgc")' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities Grid */}
            <section className="py-20 px-6 lg:px-20 bg-forest-green dark:bg-black/20 text-white rounded-t-[3rem] -mt-10 relative z-10">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center text-irova-primary">
                                <span className="material-symbols-outlined text-3xl">wifi</span>
                            </div>
                            <h3 className="font-bold text-lg">Wi-Fi de Alta Velocidad</h3>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center text-irova-primary">
                                <span className="material-symbols-outlined text-3xl">local_parking</span>
                            </div>
                            <h3 className="font-bold text-lg">Estacionamiento Privado</h3>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center text-irova-primary">
                                <span className="material-symbols-outlined text-3xl">spa</span>
                            </div>
                            <h3 className="font-bold text-lg">Spa & Wellness</h3>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center text-irova-primary">
                                <span className="material-symbols-outlined text-3xl">room_service</span>
                            </div>
                            <h3 className="font-bold text-lg">Room Service 24h</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location / Map Placeholder */}
            <section className="h-[400px] w-full relative">
                <div
                    className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXc4we80qq1x6rTLrrAMnvUJS8aOZuHx0kfIvHOfMPDClNRHkkEqy3ax3I485CqnU85B9RvIFeawKukTVumU5X8r1siGUGECZfZBmN1SAD2vjCuU-V0mb7fXzhrqLw83kQI2lnRu4hnlo9Gc_0UDPbWZtBElxw62Wi59GzQAKIpKqfDKjVGfBAbtjYrAitwOgiVpK8Gh12BlmrxeDCC3PQW9ybHmJ0yCDjCrfapfXhEz8c7EQz8Cd8FKYcdSWU47qn847R68CNIKU")' }}
                >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white dark:bg-irova-bg-dark p-8 rounded-xl shadow-2xl max-w-sm text-center">
                            <h3 className="text-2xl font-serif font-bold mb-2 text-forest-green dark:text-white">Ubicación Privilegiada</h3>
                            <p className="text-sm mb-4 text-forest-green/70 dark:text-white/70">Av. Costanera 1234, Posadas, Misiones</p>
                            <button className="px-6 py-2 border border-forest-green dark:border-white/30 rounded-full text-sm font-bold hover:bg-forest-green hover:text-white dark:hover:bg-irova-primary dark:hover:text-irova-bg-dark transition-colors">
                                Ver en Mapa
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-forest-green text-white py-16 px-6 lg:px-20 border-t border-white/10">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-irova-primary">spa</span>
                            <span className="text-2xl font-serif font-bold">Irova Hotel</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Redefiniendo la hospitalidad en Misiones con un enfoque en la sostenibilidad y el lujo consciente.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-irova-primary">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><a className="hover:text-white transition-colors" href="#">Nuestra Historia</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Habitaciones</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Sustentabilidad</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Eventos</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-irova-primary">Contacto</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">call</span> +54 376 444 4444</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">mail</span> reservas@irovahotel.com</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">location_on</span> Posadas, Misiones, AR</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-irova-primary">Boletín</h4>
                        <p className="text-xs text-white/60 mb-4">Recibe ofertas exclusivas y novedades.</p>
                        <div className="flex gap-2">
                            <input className="bg-white/10 border-none rounded-lg text-sm px-4 py-2 w-full text-white placeholder:text-white/40 focus:ring-1 focus:ring-irova-primary outline-none" placeholder="Tu email" type="email" />
                            <button className="bg-irova-primary text-irova-bg-dark px-4 py-2 rounded-lg font-bold hover:bg-[#e6e205]">
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40 flex justify-between items-center">
                    <p>© 2024 Irova Hotel. Todos los derechos reservados.</p>
                    <div className="flex gap-4">
                        <a href="#">Privacidad</a>
                        <a href="#">Términos</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

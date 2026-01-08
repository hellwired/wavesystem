"use client";

import React, { useState, useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Carousel from "./Carousel";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

// Custom Colors mapped to arbitrary Tailwind values
const colors = {
    primary: "#efa339",
    backgroundLight: "#f8f7f6",
    backgroundDark: "#221a10",
    textLight: "#181511",
    textDark: "#f4f3f0",
    accentGold: "#C5A065",
};

export default function CasamientoPage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Target Date: May 9, 2026, 20:30:00
    useEffect(() => {
        const targetDate = new Date("2026-05-09T20:30:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const copyToClipboard = async (text: string, elementId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // Simple visual feedback
            const btn = document.getElementById(elementId);
            if (btn) {
                const originalContent = btn.innerHTML;
                btn.innerHTML =
                    '<span class="material-symbols-outlined text-xl">check</span>';
                btn.classList.add("text-green-500");
                btn.classList.remove("text-[#efa339]");
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.classList.remove("text-green-500");
                    btn.classList.add("text-[#efa339]");
                }, 2000);
            }
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <div
            className={`${plusJakarta.className} font-sans bg-[#f8f7f6] dark:bg-[#221a10] text-[#181511] dark:text-[#f4f3f0] min-h-screen flex flex-col overflow-x-hidden`}
        >
            {/* Top Navigation */}
            <header className="w-full bg-white/80 dark:bg-[#221a10]/80 backdrop-blur-md border-b border-[#e6e2de] dark:border-white/10 sticky top-0 z-50 transition-all duration-300">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#efa339] text-3xl">
                            favorite
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181511] dark:text-[#f4f3f0]">
                            Claudio & Adela
                        </h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a
                            className="text-sm font-medium hover:text-[#efa339] transition-colors"
                            href="#hero"
                        >
                            Inicio
                        </a>
                        <a
                            className="text-sm font-medium hover:text-[#efa339] transition-colors"
                            href="#cuando-donde"
                        >
                            Cuándo & Dónde
                        </a>
                        <a
                            className="text-sm font-medium hover:text-[#efa339] transition-colors"
                            href="#regalos"
                        >
                            Regalos
                        </a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <a
                            className="hidden sm:flex items-center justify-center rounded-[1rem] h-10 px-5 bg-[#efa339] hover:bg-[#efa339]/90 text-white text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            href="https://wa.me/?text=Hola%2C%20confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Claudio%20y%20Adela%21"
                            target="_blank"
                        >
                            Confirmar Asistencia
                        </a>
                        <button
                            className="md:hidden p-2 text-[#181511] dark:text-[#f4f3f0]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white dark:bg-[#221a10] border-t border-gray-100 dark:border-white/5"
                        >
                            <nav className="flex flex-col p-4 gap-4">
                                <a
                                    className="text-sm font-medium hover:text-[#efa339] transition-colors"
                                    href="#hero"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Inicio
                                </a>
                                <a
                                    className="text-sm font-medium hover:text-[#efa339] transition-colors"
                                    href="#cuando-donde"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Cuándo & Dónde
                                </a>
                                <a
                                    className="text-sm font-medium hover:text-[#efa339] transition-colors"
                                    href="#regalos"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Regalos
                                </a>
                                <a
                                    className="flex items-center justify-center rounded-[1rem] h-10 px-5 bg-[#efa339] hover:bg-[#efa339]/90 text-white text-sm font-bold tracking-wide transition-all shadow-lg"
                                    href="https://wa.me/?text=Hola%2C%20confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Claudio%20y%20Adela%21"
                                    target="_blank"
                                >
                                    Confirmar Asistencia
                                </a>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-grow flex flex-col items-center w-full">
                {/* Hero Section */}
                <section
                    className="w-full relative flex items-center justify-center min-h-[85vh] overflow-hidden"
                    id="hero"
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        data-alt="Romantic floral wedding background with soft lighting"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxBZWilGwFInhwgLFCUF90_tdX3jti2ZEGbXk8hNf6l1J_sGCllC3z0ao0GHychnmOZ9haQ9nv8oXxjPPAxjb8on67FvvaxaZsOD6RuRlz5mlzrYs4D9rhDlErfqvkef3jGf_QjesZMXOFJtmBODaPSJKEvx-_AE3fBQhkAN0cOiUSu0zP1KTosn8bQMsTAMNFBsGbBJWf0CW-DWG2aMOiAfKWiqko3Ks-neMmuy8KdCf3gyoi-R924yIxBzdwnttWCLKc8h6t61E')",
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium tracking-wider uppercase">
                            ¡Nos Casamos!
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none tracking-tight drop-shadow-sm">
                            Claudio{" "}
                            <span className="text-[#efa339] font-light italic">&</span>{" "}
                            Adela
                        </h1>
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-px w-24 bg-[#efa339]/60 mb-4"></div>
                            <p className="text-xl sm:text-2xl text-white/90 font-medium">
                                9 de Mayo de 2026
                            </p>
                            <p className="text-lg text-white/80">
                                Complejo Recreativo IPS
                            </p>
                        </div>
                        <a
                            className="mt-8 flex items-center justify-center h-14 w-14 rounded-full bg-white text-[#efa339] hover:bg-[#efa339] hover:text-white transition-all duration-300 shadow-lg cursor-pointer"
                            href="#cuando-donde"
                        >
                            <span className="material-symbols-outlined text-3xl animate-bounce">
                                keyboard_arrow_down
                            </span>
                        </a>
                    </motion.div>
                </section>

                {/* Countdown Timer */}
                <section className="w-full bg-white dark:bg-[#221a10] py-12 px-4 -mt-10 relative z-20">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-[#2a2218] rounded-2xl shadow-xl border border-stone-100 dark:border-white/5 p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <span className="text-[#efa339] font-bold tracking-widest uppercase text-xs sm:text-sm">
                                La cuenta regresiva
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold mt-2 dark:text-white">
                                Para el gran día
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                            {/* Days */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-full aspect-square max-w-[120px] flex items-center justify-center bg-[#f8f7f6] dark:bg-white/5 rounded-[1.5rem] border border-stone-200 dark:border-white/10">
                                    <span className="text-4xl sm:text-5xl font-black text-[#efa339]">
                                        {timeLeft.days}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                                    Días
                                </span>
                            </div>
                            {/* Hours */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-full aspect-square max-w-[120px] flex items-center justify-center bg-[#f8f7f6] dark:bg-white/5 rounded-[1.5rem] border border-stone-200 dark:border-white/10">
                                    <span className="text-4xl sm:text-5xl font-black text-[#efa339]">
                                        {timeLeft.hours.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                                    Hs
                                </span>
                            </div>
                            {/* Minutes */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-full aspect-square max-w-[120px] flex items-center justify-center bg-[#f8f7f6] dark:bg-white/5 rounded-[1.5rem] border border-stone-200 dark:border-white/10">
                                    <span className="text-4xl sm:text-5xl font-black text-[#efa339]">
                                        {timeLeft.minutes.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                                    Min
                                </span>
                            </div>
                            {/* Seconds */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-full aspect-square max-w-[120px] flex items-center justify-center bg-[#f8f7f6] dark:bg-white/5 rounded-[1.5rem] border border-stone-200 dark:border-white/10">
                                    <span className="text-4xl sm:text-5xl font-black text-[#efa339]">
                                        {timeLeft.seconds.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                                    Seg
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Photo Carousel Section */}
                <section className="w-full bg-white dark:bg-[#221a10] py-16 px-4">
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div className="text-center space-y-3">
                            <span className="material-symbols-outlined text-4xl text-[#efa339]">
                                filter_hdr
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#181511] dark:text-[#f4f3f0]">
                                Nuestros Momentos
                            </h2>
                            <p className="text-stone-600 dark:text-stone-400 max-w-lg mx-auto">
                                Un pequeño recorrido por nuestra historia juntos.
                            </p>
                        </div>
                        <Carousel />
                    </div>
                </section>

                {/* Ceremonia y Fiesta Section */}
                <section
                    className="w-full py-20 px-4 bg-[#f8f7f6] dark:bg-[#221a10]"
                    id="cuando-donde"
                >
                    <div className="max-w-5xl mx-auto space-y-12">
                        <div className="text-center space-y-3">
                            <span className="material-symbols-outlined text-4xl text-[#efa339]">
                                church
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#181511] dark:text-[#f4f3f0]">
                                Ceremonia y Fiesta
                            </h2>
                            <p className="text-stone-600 dark:text-stone-400 max-w-lg mx-auto">
                                Te esperamos para celebrar nuestro amor en una noche
                                inolvidable.
                            </p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8 items-center bg-white dark:bg-[#2a2218] rounded-[2rem] p-4 shadow-sm border border-stone-100 dark:border-white/5 overflow-hidden">
                            <div
                                className="h-64 lg:h-full min-h-[300px] w-full bg-cover bg-center rounded-[1.5rem] relative group overflow-hidden"
                                data-alt="Elegant wedding venue garden setup"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkqWiyfYFFivcaaE6yHqwB8ajJ2P10k-rs6iH7Deku94_ljPiqMv4-THOqcgPkVopnfBmGHhEriD4trKYFVyHMzj6pxHAjw676BKESq5VQgQGKt_u3sVBzlBfA8VqAG9gJQz9yaZjt0bA7QYhtnkj-fAgnT9ajWgvKUsqLrsWylSluuqgJWHk6WLYsGi0gvmtFVmOJi38pJ5I7rj5FiaRCI68g_zUgDECs8kn4MwtHWeiY1JzUuyFivq4dSQMPFG3BmluTVruvyh0')",
                                }}
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                            </div>
                            <div className="p-4 lg:p-8 flex flex-col justify-center space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-[#181511] dark:text-[#f4f3f0]">
                                        Complejo Recreativo IPS
                                    </h3>
                                    <div className="flex items-center gap-2 text-[#efa339] font-semibold">
                                        <span className="material-symbols-outlined text-lg">
                                            calendar_month
                                        </span>
                                        <p>Sábado 9 de Mayo, 2026</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                                        <span className="material-symbols-outlined text-lg">
                                            schedule
                                        </span>
                                        <p>Recepción: 20:30 hs</p>
                                    </div>
                                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed pt-2">
                                        Únete a nosotros para una hermosa velada de celebración,
                                        cena y baile. La ceremonia se realizará en los jardines
                                        principales.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <a
                                        className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-[1rem] bg-[#efa339] text-white font-bold hover:bg-[#efa339]/90 transition-all shadow-md hover:shadow-lg"
                                        href="https://maps.app.goo.gl/HgbhewSkeXQ5GP4q8"
                                        target="_blank"
                                    >
                                        <span className="material-symbols-outlined">map</span>
                                        Ver en Mapa
                                    </a>
                                    <a
                                        className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-[1rem] border-2 border-[#efa339] text-[#efa339] font-bold hover:bg-[#efa339] hover:text-white transition-all"
                                        href="https://wa.me/?text=Hola"
                                        target="_blank"
                                    >
                                        <span className="material-symbols-outlined">chat</span>
                                        Consultar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RSVP Banner */}
                <section className="w-full py-24 px-4 bg-white dark:bg-[#2a2218] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#efa339_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                    <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-8 rounded-[2rem] border border-stone-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-5xl text-[#efa339] animate-pulse">
                            mail
                        </span>
                        <div className="space-y-2">
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#181511] dark:text-[#f4f3f0]">
                                Confirmación de Asistencia
                            </h2>
                            <p className="text-lg text-stone-600 dark:text-stone-400">
                                Es muy importante para nosotros contar con tu confirmación antes
                                del 20 de Abril.
                            </p>
                        </div>
                        <a
                            className="inline-flex items-center justify-center gap-3 h-14 px-10 rounded-[1rem] bg-[#25D366] hover:bg-[#20bd5a] text-white text-lg font-bold transition-all shadow-lg hover:shadow-green-500/20 hover:-translate-y-1 group"
                            href="https://wa.me/?text=Hola%2C%20confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Claudio%20y%20Adela"
                            target="_blank"
                        >
                            <svg
                                className="w-6 h-6 fill-current group-hover:scale-110 transition-transform"
                                viewBox="0 0 448 512"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l121.7-31.9c32.4 17.7 68.9 27 106.5 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-26.3l-6.7-4.2-69.8 18.3 18.6-68.1-4.4-6.9c-18.3-29.1-28-63-28-98.2 0-101.5 82.6-184.1 184.1-184.1 49.2 0 95.4 19.2 130.3 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                            </svg>
                            Confirmar por WhatsApp
                        </a>
                    </div>
                </section>

                {/* Gift Registry Section */}
                <section
                    className="w-full py-20 px-4 bg-stone-50 dark:bg-[#221a10] border-t border-stone-200 dark:border-white/5"
                    id="regalos"
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10 space-y-3">
                            <span className="material-symbols-outlined text-4xl text-[#efa339]">
                                redeem
                            </span>
                            <h2 className="text-3xl font-bold text-[#181511] dark:text-[#f4f3f0]">
                                Regalos
                            </h2>
                            <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
                                El mejor regalo es tu presencia, pero si deseas hacernos un
                                presente puedes hacerlo a la siguiente cuenta.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Bank Account Card */}
                            <div className="bg-white dark:bg-[#2a2218] p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-white/5 flex flex-col justify-between group hover:border-[#efa339]/30 transition-colors">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-[#efa339]/10 rounded-lg text-[#efa339]">
                                            <span className="material-symbols-outlined">
                                                account_balance
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg dark:text-white">
                                            Datos Bancarios
                                        </h3>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                                            CBU
                                        </p>
                                        <div className="flex items-center justify-between gap-4 bg-stone-50 dark:bg-black/20 p-3 rounded-lg border border-stone-100 dark:border-white/5">
                                            <code className="text-sm sm:text-base font-mono text-stone-700 dark:text-stone-300 truncate">
                                                0000003100048291039912
                                            </code>
                                            <button
                                                id="btn-copy-cbu"
                                                className="text-[#efa339] hover:text-[#efa339]/70 p-1 transition-colors"
                                                title="Copiar CBU"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        "0000003100048291039912",
                                                        "btn-copy-cbu"
                                                    )
                                                }
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    content_copy
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                                            Alias
                                        </p>
                                        <div className="flex items-center justify-between gap-4 bg-stone-50 dark:bg-black/20 p-3 rounded-lg border border-stone-100 dark:border-white/5">
                                            <code className="text-sm sm:text-base font-mono text-stone-700 dark:text-stone-300">
                                                BODA.CLAUDIO.ADELA
                                            </code>
                                            <button
                                                id="btn-copy-alias"
                                                className="text-[#efa339] hover:text-[#efa339]/70 p-1 transition-colors"
                                                title="Copiar Alias"
                                                onClick={() =>
                                                    copyToClipboard("BODA.CLAUDIO.ADELA", "btn-copy-alias")
                                                }
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    content_copy
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Envelope Box Message */}
                            <div className="bg-[#efa339]/5 dark:bg-[#efa339]/10 p-6 rounded-2xl border border-[#efa339]/20 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-[#efa339] shadow-sm">
                                    <span className="material-symbols-outlined text-3xl">
                                        mark_email_unread
                                    </span>
                                </div>
                                <h3 className="font-bold text-xl text-[#181511] dark:text-[#f4f3f0]">
                                    Buzón de Sobres
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                                    También contaremos con un buzón para sobres en la recepción
                                    del salón si prefieres entregar tu presente personalmente.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {/* Footer */}
            <footer className="w-full bg-white dark:bg-[#1a140e] border-t border-stone-200 dark:border-white/5 py-12">
                <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center justify-center gap-6">
                    <h2 className="text-2xl font-bold text-[#181511] dark:text-[#f4f3f0]">
                        Claudio & Adela
                    </h2>
                    <div className="flex gap-2 text-[#efa339]">
                        <span className="material-symbols-outlined">favorite</span>
                        <span className="material-symbols-outlined">favorite</span>
                        <span className="material-symbols-outlined">favorite</span>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 text-center max-w-sm">
                        Gracias por ser parte de nuestra historia y acompañarnos en este
                        momento tan especial.
                    </p>
                    <div className="w-full h-px bg-stone-100 dark:bg-white/5 max-w-xs my-2"></div>
                    <p className="text-xs text-stone-400 dark:text-stone-600">
                        © 2025 Claudio & Adela. Diseñado con amor.
                    </p>
                </div>
            </footer>
        </div>
    );
}

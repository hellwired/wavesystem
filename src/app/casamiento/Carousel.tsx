"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    "/next/images/casamiento/photo-1.jpg",
    "/next/images/casamiento/photo-2.jpg",
    "/next/images/casamiento/photo-3.jpg",
    "/next/images/casamiento/photo-4.jpg",
    "/next/images/casamiento/photo-5.jpg",
];

export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <img
                        src={images[currentIndex]}
                        alt={`Foto ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Anterior"
            >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Siguiente"
            >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex
                            ? "bg-white w-6"
                            : "bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Ir a foto ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/articulos-del-sur" className="flex-shrink-0 font-bold text-2xl tracking-tight">
                        <span className="text-white">Articulos</span>
                        <span className="text-sky-400">DelSur</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/articulos-del-sur" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Inicio
                        </Link>
                        <Link href="/articulos-del-sur/productos" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Productos
                        </Link>
                        <Link href="/articulos-del-sur/ofertas" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Ofertas
                        </Link>
                        <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Nosotros
                        </Link>
                        <Link href="/articulos-del-sur/admin/dashboard" className="text-orange-500 hover:text-orange-400 transition-colors text-sm font-bold">
                            Panel Admin
                        </Link>
                        <Link href="/articulos-del-sur/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Iniciar Sesión
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-300 hover:text-white transition-colors">
                            <Search size={20} />
                        </button>
                        <div className="relative">
                            <button className="text-gray-300 hover:text-white transition-colors">
                                <ShoppingCart size={20} />
                            </button>
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                2
                            </span>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link href="/articulos-del-sur" className="block px-3 py-2 text-base font-medium text-white bg-slate-800 rounded-md">
                                Inicio
                            </Link>
                            <Link href="/articulos-del-sur/productos" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md">
                                Productos
                            </Link>
                            <Link href="/articulos-del-sur/ofertas" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md">
                                Ofertas
                            </Link>
                            <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md">
                                Nosotros
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

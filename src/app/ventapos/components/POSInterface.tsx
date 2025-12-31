'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getProducts } from '../actions/products';
import { Product } from '../schemas';
import POSGrid from './POSGrid';
import Cart from './Cart';
import CashControl from './CashControl';
import { useCartStore } from '../store/cart-store';
import { Loader2, LogOut } from 'lucide-react';
import { logoutAction } from '../actions/auth';

export default function POSInterface() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [cashSessionOpen, setCashSessionOpen] = useState(false); // Check real status later

    useEffect(() => {
        async function fetchProducts() {
            const res = await getProducts();
            if (res.success && res.data) {
                setProducts(res.data);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    // Stable search handler to prevent effect loops
    const handleSearch = useCallback(async (q: string) => {
        // Do NOT set main loading state here to prevent unmounting!
        setSearching(true);
        const res = await getProducts(q);
        if (res.success && res.data) {
            setProducts(res.data);
        }
        setSearching(false);
    }, []);

    // Hotkeys listener could go here

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-neutral-950 text-emerald-500">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    /* 
      Logic: If no session open, show CashControl (Opening).
      If session open, show POS (Grid + Cart).
      For now, toggle for demo.
    */

    return (
        <div className="flex h-full w-full bg-neutral-950 text-neutral-200">
            {/* Left: Product Grid */}
            <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
                <header className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        WaveSystem POS
                    </h1>
                    <div className="flex gap-2 items-center">
                        {searching && <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />}
                        <span className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-neutral-400">
                            {cashSessionOpen ? 'Caja Abierta' : 'Caja Cerrada'}
                        </span>
                        <Link
                            href="/ventapos/dashboard"
                            className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 rounded-full transition-colors"
                            title="Volver al Dashboard"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                        </Link>
                        <button
                            onClick={() => logoutAction()}
                            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-full transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <POSGrid
                    products={products}
                    onSearch={handleSearch}
                />
            </div>

            {/* Right: Cart & Actions */}
            <div className="w-[400px] border-l border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex flex-col">
                <Cart />
            </div>
        </div>
    );
}

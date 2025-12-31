'use client';

import React, { useState } from 'react';
import { Product } from '../schemas';
import { useCartStore } from '../store/cart-store';
import { Search, Package } from 'lucide-react';

export default function POSGrid({ products, onSearch, searchRef }: { products: Product[], onSearch: (query: string) => void, searchRef?: React.RefObject<HTMLInputElement> }) {
    const [query, setQuery] = useState('');
    const addItem = useCartStore((state) => state.addItem);

    // Debounce search
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(query);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [query, onSearch]);

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-emerald-500 transition-colors">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    ref={searchRef}
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-800 rounded-xl leading-5 bg-neutral-900 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg"
                    placeholder="Buscar productos (F2) - Nombre, Código, Barra..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => addItem(product)}
                        className="flex flex-col p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20 active:scale-95 transition-all duration-200 group text-left h-[140px]"
                    >
                        <div className="flex justify-between items-start w-full mb-2">
                            <Package className="w-5 h-5 text-neutral-600 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-mono text-neutral-500 group-hover:text-neutral-400">
                                ${Number(product.salePrice).toFixed(2)}
                            </span>
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-sm font-medium text-neutral-200 line-clamp-2 leading-tight group-hover:text-emerald-100">
                                {product.description}
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1">Stock: {product.stock}</p>
                        </div>
                    </button>
                ))}

                {products.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center text-neutral-500 py-10">
                        <Package className="w-12 h-12 mb-2 opacity-20" />
                        <p>No se encontraron productos</p>
                    </div>
                )}
            </div>
        </div>
    );
}

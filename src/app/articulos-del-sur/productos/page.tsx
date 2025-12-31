'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [priceRange, setPriceRange] = useState(2000000);

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['Todos']);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catRes = await fetch('/next/api/categories');
                const catData = await catRes.json();
                setCategories(['Todos', ...catData.map((c: any) => c.name)]);

                // Fetch Products
                const prodRes = await fetch('/next/api/products');
                const prodData = await prodRes.json();
                const mappedProducts = prodData.map((p: any) => ({
                    id: String(p.id),
                    title: p.name,
                    price: Number(p.price),
                    category: p.category_name,
                    image: p.image_url ? `/next/${p.image_url}` : 'https://placehold.co/400x300/png?text=Sin+Imagen',
                    discount: 0
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(product =>
        (selectedCategory === 'Todos' || product.category === selectedCategory) &&
        product.price <= priceRange
    );

    return (
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center">
                                <Filter size={20} className="mr-2" /> Filtros
                            </h3>
                            <button className="text-sm text-orange-500 font-medium hover:underline">
                                Limpiar
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h4 className="font-semibold text-slate-900 mb-4">Categorías</h4>
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat
                                                ? 'bg-orange-50 text-orange-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <h4 className="font-semibold text-slate-900 mb-4">Precio Máximo</h4>
                            <input
                                type="range"
                                min="0"
                                max="2000000"
                                step="10000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>$0</span>
                                <span className="font-medium text-slate-900">${priceRange.toLocaleString()}</span>
                            </div>
                        </div>


                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {selectedCategory === 'Todos' ? 'Todos los Productos' : selectedCategory}
                            <span className="ml-2 text-sm font-normal text-gray-600">({filteredProducts.length} resultados)</span>
                        </h1>

                        <div className="flex items-center space-x-4">
                            <div className="relative hidden sm:block">
                                <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                                    <option>Más Relevantes</option>
                                    <option>Menor Precio</option>
                                    <option>Mayor Precio</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                            <button className="md:hidden p-2 bg-white border border-gray-200 rounded-lg text-gray-700">
                                <SlidersHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <p className="text-gray-600 text-lg">No se encontraron productos con estos filtros.</p>
                            <button
                                onClick={() => { setSelectedCategory('Todos'); setPriceRange(2000000); }}
                                className="mt-4 text-orange-500 font-medium hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

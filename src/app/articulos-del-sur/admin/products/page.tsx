'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    category_name: string;
    is_featured: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            console.log('Fetching products from /next/api/products...');
            const res = await fetch('/next/api/products');
            console.log('Response status:', res.status);

            if (res.ok) {
                const data = await res.json();
                console.log('Products received:', data);
                setProducts(data);
            } else {
                console.error('Fetch failed:', await res.text());
                alert('Error al cargar productos. Revisa la consola.');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Error de red al cargar productos.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const res = await fetch(`/next/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProducts();
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
                    <p className="text-gray-500">Gestiona tu catálogo de productos</p>
                </div>
                <Link
                    href="/articulos-del-sur/admin/products/create"
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                    <Plus size={20} /> Nuevo Producto
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 size={32} className="animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold text-sm">
                            <tr>
                                <th className="p-4">Producto</th>
                                <th className="p-4">Categoría</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-center">Destacado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-900">{product.name}</td>
                                    <td className="p-4 text-gray-500">{product.category_name || '-'}</td>
                                    <td className="p-4 font-mono font-medium">${Number(product.price).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock} u.
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {product.is_featured ? (
                                            <span className="text-orange-500 text-xs font-bold px-2 py-1 bg-orange-50 rounded">SI</span>
                                        ) : (
                                            <span className="text-gray-300 text-xs">NO</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/articulos-del-sur/admin/products/${product.id}`}
                                                className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

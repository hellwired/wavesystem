'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Loader2, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import TransferModal from '../products/TransferModal';

interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    stock_deposito: number;
    stock_local: number;
    category_name: string;
}

export default function DepositosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/next/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
                alert('Error al cargar productos');
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const openTransferModal = (product: Product) => {
        setSelectedProduct({
            id: product.id,
            name: product.name,
            stock_deposito: Number(product.stock_deposito)
        });
        setTransferModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este artículo del depósito? Esta acción es irreversible.')) return;

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
                    <h1 className="text-3xl font-bold text-slate-800">Depósito Central</h1>
                    <p className="text-gray-500">Gestión de stock de artículos en almacén (ID 1)</p>
                </div>
                <Link
                    href="/articulos-del-sur/admin/depositos/create"
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                    <Plus size={20} /> Alta en Depósito
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar en depósito..."
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold text-sm">
                                <tr>
                                    <th className="p-4">Artículo</th>
                                    <th className="p-4">Categoría</th>
                                    <th className="p-4 text-center bg-orange-50/50">Stock en Depósito (ID 1)</th>
                                    <th className="p-4 text-center">Referencia Local</th>
                                    <th className="p-4 text-right">Precio Ref.</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900">{product.name}</td>
                                        <td className="p-4 text-gray-500">{product.category_name || '-'}</td>

                                        {/* Stock Depósito Destacado */}
                                        <td className="p-4 text-center bg-orange-50/20">
                                            <span className={`text-lg font-bold ${Number(product.stock_deposito) > 0 ? 'text-orange-700' : 'text-gray-400'}`}>
                                                {product.stock_deposito}
                                            </span>
                                        </td>

                                        {/* Referencia Local */}
                                        <td className="p-4 text-center text-gray-400 text-sm">
                                            {product.stock_local}
                                        </td>

                                        <td className="p-4 text-right font-mono text-gray-500">
                                            ${Number(product.price).toLocaleString()}
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openTransferModal(product)}
                                                    title="Enviar al Local Uruguay"
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-bold text-xs"
                                                >
                                                    <ArrowRightLeft size={14} /> Enviar a Local
                                                </button>
                                                <Link
                                                    href={`/articulos-del-sur/admin/depositos/${product.id}`}
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
                    </div>
                )}
            </div>


            <TransferModal
                isOpen={transferModalOpen}
                onClose={() => setTransferModalOpen(false)}
                onSuccess={fetchProducts}
                product={selectedProduct}
            />
        </div >
    );
}

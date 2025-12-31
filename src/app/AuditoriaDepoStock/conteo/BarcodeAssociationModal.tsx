'use client';

import { useState, useEffect } from 'react';
import { searchProducts } from '@/app/actions/auditoria';

interface BarcodeAssociationModalProps {
    isOpen: boolean;
    onClose: () => void;
    scannedCode: string;
    onAssociate: (productSku: string) => Promise<void>;
}

export default function BarcodeAssociationModal({
    isOpen,
    onClose,
    scannedCode,
    onAssociate
}: BarcodeAssociationModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [associating, setAssociating] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults([]);
            setLoading(false);
            setAssociating(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                const products = await searchProducts(query);
                setResults(products);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleAssociate = async (productSku: string) => {
        if (confirm('¿Confirmar asociación?')) {
            setAssociating(true);
            await onAssociate(productSku);
            setAssociating(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        Asociar Código de Barras
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            El código <span className="font-bold">{scannedCode}</span> no fue encontrado.
                            Busca un producto existente para asociarlo.
                        </p>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Buscar producto por nombre o SKU..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#101622] dark:text-white"
                            autoFocus
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {loading && <p className="text-center text-gray-500 text-sm">Buscando...</p>}

                        {!loading && results.length === 0 && query.length > 2 && (
                            <p className="text-center text-gray-500 text-sm">No se encontraron productos.</p>
                        )}

                        {results.map((product) => (
                            <div
                                key={product.sku}
                                onClick={() => handleAssociate(product.sku)}
                                className={`p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors ${associating ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                <div className="font-medium text-gray-900 dark:text-white">{product.nombre}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex gap-2">
                                    <span>SKU: {product.sku}</span>
                                    <span>•</span>
                                    <span>Cat: {product.categoria || 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

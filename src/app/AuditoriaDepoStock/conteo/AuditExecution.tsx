'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ConteoRow from './ConteoRow';
import BarcodeScanner from './BarcodeScanner';
import { findAuditItem, associateBarcodeToProduct } from '@/app/actions/auditoria';
import BarcodeAssociationModal from './BarcodeAssociationModal';

interface AuditExecutionProps {
    conteos: any[];
    auditId: number;
    auditType: string;
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

export default function AuditExecution({
    conteos,
    auditId,
    auditType,
    totalPages,
    currentPage,
    totalItems
}: AuditExecutionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filter, setFilter] = useState(searchParams.get('search') || '');
    const itemRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});
    const [showAssociationModal, setShowAssociationModal] = useState(false);
    const [unknownCode, setUnknownCode] = useState('');

    // Debounce search update
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (filter) {
                params.set('search', filter);
            } else {
                params.delete('search');
            }
            params.set('page', '1'); // Reset to page 1 on search
            router.push(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(handler);
    }, [filter, router, searchParams]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleScan = async (code: string) => {
        // Try to find in current page first
        const itemOnPage = conteos.find(c => c.producto_sku === code || c.ubicacion_codigo === code);

        if (itemOnPage) {
            highlightAndFocus(itemOnPage.id);
        } else {
            // Find on server
            try {
                const item = await findAuditItem(auditId, code);
                if (item) {
                    // Update filter to find specific item
                    setFilter(code);
                    // Note: The useEffect will trigger the search and likely show the item.
                    // We might need a way to auto-focus it after load, but for now this is good.
                    // alert(`Item encontrado: ${item.producto_nombre}. Filtrando...`); // Removed alert to be less intrusive
                } else {
                    // alert(`Código no encontrado: ${code}`);
                    setUnknownCode(code);
                    setShowAssociationModal(true);
                }
            } catch (error) {
                console.error('Scan error:', error);
                alert('Error al buscar el producto.');
            }
        }
    };

    const handleAssociateProduct = async (sku: string) => {
        const result = await associateBarcodeToProduct(sku, unknownCode);
        if (result.success) {
            // alert('Código asociado correctamente.');
            handleScan(unknownCode); // Re-scan to find/highlight
        } else {
            alert('Error al asociar: ' + result.error);
        }
    };

    const highlightAndFocus = (id: number) => {
        const row = itemRefs.current[id];
        if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.classList.add('bg-blue-100', 'dark:bg-blue-900/40');
            setTimeout(() => {
                row.classList.remove('bg-blue-100', 'dark:bg-blue-900/40');
            }, 2000);

            const input = row.querySelector('input');
            if (input) {
                input.focus();
                input.select();
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Scanner & Filter */}
            <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl shadow-sm border border-[#e7ebf3] dark:border-[#2a3441] flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <BarcodeScanner onScan={handleScan} />
                </div>
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 notranslate">search</span>
                        </div>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white dark:bg-[#1a2230]"
                            placeholder="Buscar por SKU, Nombre o Ubicación..."
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-[#e7ebf3] dark:border-[#2a3441] overflow-hidden">
                <div className="p-4 border-b border-[#e7ebf3] dark:border-[#2a3441] bg-gray-50 dark:bg-[#101622]/50 flex justify-between items-center">
                    <h3 className="font-semibold text-[#0d121b] dark:text-white">
                        Items ({totalItems}) - Página {currentPage} de {totalPages}
                    </h3>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                        >
                            <span className="material-symbols-outlined notranslate">chevron_left</span>
                        </button>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                        >
                            <span className="material-symbols-outlined notranslate">chevron_right</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-full lg:min-w-[1000px]">
                        <thead>
                            <tr className="hidden lg:table-row border-b border-[#e7ebf3] dark:border-[#2a3441] text-xs font-medium text-[#4c669a] dark:text-gray-400 uppercase tracking-wider">
                                <th className="p-4">Ubicación</th>
                                <th className="p-4">Producto</th>
                                <th className="p-4">SKU</th>
                                <th className="p-4 text-center">Esperado</th>
                                <th className="p-4 text-center">Conteo Real</th>
                                <th className="p-4 text-center">Diferencia</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7ebf3] dark:divide-[#2a3441] flex flex-col lg:table-row-group">
                            {conteos.map((item) => (
                                <div
                                    key={item.id}
                                    ref={el => { itemRefs.current[item.id] = el as any; }}
                                    className="contents"
                                >
                                    <ConteoRow item={item} auditoriaId={auditId} auditType={auditType} />
                                </div>
                            ))}
                            {conteos.length === 0 && (
                                <tr className="lg:table-row">
                                    <td colSpan={8} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No se encontraron items.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-[#e7ebf3] dark:border-[#2a3441] flex justify-center">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="text-sm text-gray-500">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <BarcodeAssociationModal
                isOpen={showAssociationModal}
                onClose={() => setShowAssociationModal(false)}
                scannedCode={unknownCode}
                onAssociate={handleAssociateProduct}
            />
        </div>
    );
}

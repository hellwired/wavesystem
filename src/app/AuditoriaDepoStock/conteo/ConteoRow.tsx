'use client';
import { useState } from 'react';
import { saveConteo } from '@/app/actions/auditoria';

import FindingModal from './FindingModal';

export default function ConteoRow({ item, auditoriaId, auditType }: { item: any, auditoriaId: number, auditType: string }) {
    const [cantidad, setCantidad] = useState(item.cantidad_real !== null ? item.cantidad_real : (auditType === 'auditoria' ? '' : item.cantidad_esperada));
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        const formData = new FormData();
        formData.append('auditoria_id', auditoriaId.toString());
        formData.append('sku', item.producto_sku);
        formData.append('cantidad', cantidad.toString());
        try {
            await saveConteo(formData);
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setSaving(false);
        }
    };

    const isDiscrepancy = item.cantidad_real !== null && item.cantidad_real !== item.cantidad_esperada;
    const isCounted = item.cantidad_real !== null;
    const isBlind = auditType === 'auditoria';

    return (
        <>
            <tr className={`
                flex flex-col lg:table-row p-4 lg:p-0 border-b lg:border-none transition-colors
                ${isCounted ? (isDiscrepancy ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'bg-green-50 dark:bg-green-900/10') : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
            `}>
                {/* Ubicación - Mobile Label */}
                <td className="lg:table-cell px-0 lg:px-4 py-1 lg:py-3">
                    <div className="flex items-center justify-between lg:block">
                        <span className="lg:hidden text-xs font-bold text-[#4c669a] uppercase">Ubicación</span>
                        <span className="text-sm font-bold text-blue-600 lg:text-[#4c669a] lg:dark:text-gray-400">
                            {item.ubicacion_codigo || 'N/A'}
                        </span>
                    </div>
                </td>

                {/* Producto */}
                <td className="lg:table-cell px-0 lg:px-4 py-1 lg:py-3">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3">
                        <span className="lg:hidden text-xs font-bold text-[#4c669a] uppercase">Producto</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#0d121b] dark:text-white">{item.producto_nombre || 'Producto Desconocido'}</span>
                            <span className="text-xs text-[#4c669a] dark:text-gray-400 lg:hidden">SKU: {item.producto_sku}</span>
                            {item.notas && (
                                <span className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-[14px]">flag</span>
                                    {item.notas}
                                </span>
                            )}
                        </div>
                    </div>
                </td>

                {/* SKU - Desktop only or hidden on mobile (already in product) */}
                <td className="hidden lg:table-cell px-4 py-3 text-sm text-[#4c669a] dark:text-gray-400">
                    {item.producto_sku}
                </td>

                {/* Esperado */}
                <td className="lg:table-cell px-0 lg:px-4 py-1 lg:py-3">
                    <div className="flex items-center justify-between lg:justify-center">
                        <span className="lg:hidden text-xs font-bold text-[#4c669a] uppercase">Esperado</span>
                        <span className={`text-sm text-[#0d121b] dark:text-white font-bold ${isBlind ? 'blur-sm select-none' : ''}`}>
                            {isBlind ? '???' : item.cantidad_esperada}
                        </span>
                    </div>
                </td>

                {/* Conteo Real */}
                <td className="lg:table-cell px-0 lg:px-4 py-2 lg:py-3">
                    <div className="flex items-center justify-between lg:justify-center gap-4">
                        <span className="lg:hidden text-xs font-bold text-[#4c669a] uppercase">Conteo Real</span>
                        <div className="relative w-32 lg:w-24">
                            <input
                                className={`block w-full rounded-lg border-0 py-2 lg:py-1.5 text-[#0d121b] dark:text-white ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm text-center font-black bg-white dark:bg-gray-800 ${isDiscrepancy ? 'ring-red-400 focus:ring-red-500' : 'ring-[#e7ebf3] dark:ring-[#2a3441] focus:ring-blue-600'
                                    }`}
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(Number(e.target.value))}
                                placeholder={isBlind ? "?" : ""}
                            />
                        </div>
                    </div>
                </td>

                {/* Diferencia (Calculated) */}
                <td className="lg:table-cell px-0 lg:px-4 py-1 lg:py-3">
                    <div className="flex items-center justify-between lg:justify-center">
                        <span className="lg:hidden text-xs font-bold text-[#4c669a] uppercase">Diferencia</span>
                        {isCounted ? (
                            <span className={`text-sm font-bold ${cantidad - item.cantidad_esperada === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {cantidad - item.cantidad_esperada > 0 ? '+' : ''}{cantidad - item.cantidad_esperada}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-400">-</span>
                        )}
                    </div>
                </td>

                {/* Estado/Fecha */}
                <td className="lg:table-cell px-0 lg:px-4 py-1 lg:py-3">
                    <div className="flex items-center justify-between lg:justify-center">
                        <span className="lg:hidden text-xs font-bold text-[#4c669a] uppercase">Estado</span>
                        <span className="text-xs text-[#4c669a] dark:text-gray-400">
                            {isCounted ? `Contado ${new Date(item.fecha_conteo).toLocaleDateString()}` : 'Pendiente'}
                        </span>
                    </div>
                </td>

                {/* Acciones */}
                <td className="lg:table-cell px-0 lg:px-4 py-3 lg:py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                            title="Reportar Hallazgo"
                        >
                            <span className="material-symbols-outlined text-[20px]">flag</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-bold transition-all
                                ${saving ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'}
                            `}
                        >
                            {saving ? '...' : 'Guardar'}
                        </button>
                    </div>
                </td>
            </tr>
            {showModal && (
                <FindingModal
                    conteoId={item.id}
                    initialNotes={item.notas}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}


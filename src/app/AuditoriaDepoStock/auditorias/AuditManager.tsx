'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAuditoria, StockSource } from '@/app/actions/auditoria';

interface AuditManagerProps {
    zones: string[];
    categories: string[];
    stockSources: StockSource[];
}

export default function AuditManager({ zones, categories, stockSources }: AuditManagerProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        descripcion: '',
        tipo: 'ciclica', // 'ciclica', 'general', 'especial', 'inspeccion'
        alcance: 'zona', // 'zona', 'categoria', 'aleatorio'
        valor_alcance: zones[0] || '',
        zona: zones[0] || 'General', // For the main record
        deposito: '',
        fecha_stock: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-select first source if available
    useEffect(() => {
        if (stockSources.length > 0 && !formData.deposito) {
            setFormData(prev => ({
                ...prev,
                deposito: stockSources[0].deposito,
                fecha_stock: stockSources[0].fecha_datos
            }));
        }
    }, [stockSources]);

    // derived available dates for selected deposit
    const availableDates = stockSources
        .filter(s => s.deposito === formData.deposito)
        .map(s => s.fecha_datos)
        .filter((value, index, self) => self.indexOf(value) === index); // unique

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // If deposit changes, pick the first date available for that deposit to avoid mismatch
            if (name === 'deposito') {
                const datesForDeposit = stockSources.filter(s => s.deposito === value).map(s => s.fecha_datos);
                if (datesForDeposit.length > 0) {
                    newData.fecha_stock = datesForDeposit[0];
                } else {
                    newData.fecha_stock = '';
                }
            }

            // Reset dependent value if scope changes
            if (name === 'alcance') {
                newData.valor_alcance = '';
            }
            // Update main zone if scope is zone
            if (name === 'valor_alcance' && newData.alcance === 'zona') {
                newData.zona = value;
            }

            return newData;
        });
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            await createAuditoria(data);
            alert('Auditoría creada exitosamente');
            router.push('/AuditoriaDepoStock/conteo');
        } catch (error) {
            alert('Error al crear auditoría');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0d121b] dark:text-white">Nueva Auditoría / Inspección</h2>
                <div className="flex items-center gap-2">
                    <span className={`size-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
                    <span className={`size-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
                    <span className={`size-3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-[#0d121b] dark:text-white">1. Fuente y Definición</h3>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 mb-2">
                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Origen de Datos (Stock)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Depósito</span>
                                    <select
                                        name="deposito"
                                        value={formData.deposito}
                                        onChange={handleChange}
                                        className="h-9 rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#101622] px-2 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    >
                                        <option value="">Seleccionar Depósito...</option>
                                        {[...new Set(stockSources.map(s => s.deposito))].map(dep => (
                                            <option key={dep} value={dep}>{dep}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Fecha de Stock</span>
                                    <select
                                        name="fecha_stock"
                                        value={formData.fecha_stock}
                                        onChange={handleChange}
                                        className="h-9 rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#101622] px-2 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    >
                                        {availableDates.map(date => (
                                            <option key={date} value={date}>{date}</option>
                                        ))}
                                        {availableDates.length === 0 && <option value="">Sin fechas disponibles</option>}
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Tipo de Tarea</span>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    className="h-10 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#101622] px-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                >
                                    <option value="ciclica">Auditoría Cíclica (Regular)</option>
                                    <option value="general">Auditoría General (Inventario Completo)</option>
                                    <option value="especial">Auditoría Especial (Investigación)</option>
                                    <option value="inspeccion">Inspección Operativa (Rápida)</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Descripción / Referencia</span>
                                <input
                                    type="text"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Ej: Auditoría Q4, Inspección Pasillo 3..."
                                    required
                                    className="h-10 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#101622] px-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!formData.deposito || !formData.fecha_stock}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-[#0d121b] dark:text-white">2. Alcance</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Definir por</span>
                                <select
                                    name="alcance"
                                    value={formData.alcance}
                                    onChange={handleChange}
                                    className="h-10 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#101622] px-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                >
                                    <option value="zona">Zona Física</option>
                                    <option value="categoria">Categoría de Producto</option>
                                    <option value="aleatorio">Muestra Aleatoria</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-[#4c669a] dark:text-gray-400">
                                    {formData.alcance === 'zona' ? 'Seleccionar Zona' :
                                        formData.alcance === 'categoria' ? 'Seleccionar Categoría' :
                                            'Cantidad de Items'}
                                </span>
                                {formData.alcance === 'zona' ? (
                                    <select
                                        name="valor_alcance"
                                        value={formData.valor_alcance}
                                        onChange={handleChange}
                                        className="h-10 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#101622] px-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {zones.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                ) : formData.alcance === 'categoria' ? (
                                    <select
                                        name="valor_alcance"
                                        value={formData.valor_alcance}
                                        onChange={handleChange}
                                        className="h-10 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#101622] px-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        name="valor_alcance"
                                        value={formData.valor_alcance}
                                        onChange={handleChange}
                                        placeholder="Ej: 50"
                                        className="h-10 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#101622] px-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    />
                                )}
                            </label>
                        </div>

                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-2 text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Atrás
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-[#0d121b] dark:text-white">3. Confirmación</h3>

                        <div className="bg-gray-50 dark:bg-[#101622] p-4 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] flex flex-col gap-2">
                            <div className="pb-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                                <p className="text-sm text-gray-500">Origen de Datos:</p>
                                <p className="text-sm font-bold text-[#0d121b] dark:text-white">{formData.deposito}</p>
                                <p className="text-xs text-gray-500">{formData.fecha_stock}</p>
                            </div>
                            <p className="text-sm"><span className="font-semibold">Tipo:</span> {formData.tipo.toUpperCase()}</p>
                            <p className="text-sm"><span className="font-semibold">Descripción:</span> {formData.descripcion}</p>
                            <p className="text-sm"><span className="font-semibold">Alcance:</span> {formData.alcance.toUpperCase()} - {formData.valor_alcance}</p>
                        </div>

                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-4 py-2 text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Atrás
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting ? 'Creando...' : 'Crear Auditoría'}
                                {!isSubmitting && <span className="material-symbols-outlined text-[18px]">check</span>}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { importProductsFromDBF } from '@/app/actions/import_auditoria';
import { Upload, FileType, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Calendar, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [processed, setProcessed] = useState(0);
    const [fileName, setFileName] = useState('');

    // New state for form fields
    const [deposito, setDeposito] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!deposito.trim()) {
            setStatus('error');
            setMessage('Por favor, ingresa el nombre del depósito antes de seleccionar el archivo.');
            // Reset file input value to allow re-selection
            e.target.value = '';
            return;
        }

        setFileName(file.name);
        setStatus('uploading');
        setMessage('Procesando archivo y sincronizando base de datos...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('deposito', deposito);
        formData.append('fecha', fecha);

        try {
            const result = await importProductsFromDBF(formData);
            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setProcessed(result.recordsProcessed || 0);
            } else {
                setStatus('error');
                setMessage(result.message || 'Error desconocido');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Error de conexión con el servidor.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/AuditoriaDepoStock" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline mb-2">
                    <ArrowLeft size={16} />
                    Volver al Dashboard
                </Link>
                <h1 className="text-[#0d121b] dark:text-white text-3xl font-black tracking-tight">Centro de Importación</h1>
                <p className="text-[#4c669a] dark:text-gray-400 text-base leading-relaxed">
                    Sincroniza tu maestro de productos cargando el archivo de stock actualizado.
                </p>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-[#1a2230] rounded-2xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-xl overflow-hidden">
                <div className="p-8 sm:p-12">
                    {status === 'idle' && (
                        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                            <div className="size-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <Upload size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-[#0d121b] dark:text-white mb-2">Cargar archivo de stock</h2>
                            <p className="text-[#4c669a] dark:text-gray-400 text-sm mb-8">
                                Complete los datos del depósito y seleccione el archivo <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">aspre.xls</code> (DBF).
                            </p>

                            {/* Form Inputs */}
                            <div className="w-full flex flex-col gap-4 mb-8 text-left">
                                <div>
                                    <label className="block text-sm font-semibold text-[#0d121b] dark:text-white mb-1.5">
                                        Nombre del Depósito <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Building2 size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={deposito}
                                            onChange={(e) => setDeposito(e.target.value)}
                                            placeholder="Ej. Depósito Central"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#101622] border border-[#e7ebf3] dark:border-[#2a3441] rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#0d121b] dark:text-white mb-1.5">
                                        Fecha de Stock
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Calendar size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#101622] border border-[#e7ebf3] dark:border-[#2a3441] rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <label className={`relative group ${!deposito.trim() ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}>
                                <div className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                                    <FileType size={20} />
                                    Seleccionar Archivo e Importar
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".xls,.dbf,.zip,.rar"
                                    onChange={handleFileChange}
                                    disabled={!deposito.trim()}
                                />
                            </label>

                            <p className="mt-6 text-xs text-gray-400">
                                Tamaño máximo recomendado: 100MB. Formatos soportados: .zip, .rar, .xls (DBF), .dbf
                            </p>
                        </div>
                    )}

                    {status === 'uploading' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative mb-8">
                                <Loader2 size={80} className="text-blue-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Upload size={32} className="text-blue-600/50" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-[#0d121b] dark:text-white mb-2">Sincronizando...</h2>
                            <p className="text-[#4c669a] dark:text-gray-400 text-sm animate-pulse mb-8 max-w-sm text-center">
                                {message}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-[#4c669a]">
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} />
                                    <span>{deposito}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{new Date(fecha).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-8 overflow-hidden">
                                <div className="bg-blue-600 h-full w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center justify-center text-center py-8">
                            <div className="size-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-[#0d121b] dark:text-white mb-2">¡Sincronización Exitosa!</h2>
                            <p className="text-[#4c669a] dark:text-gray-400 text-sm mb-8">
                                Se han procesado y actualizado correctamente los datos del archivo.
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                                <div className="bg-gray-50 dark:bg-[#101622] p-4 rounded-xl border border-gray-100 dark:border-[#2a3441]">
                                    <span className="text-xs text-gray-400 block mb-1">Registros</span>
                                    <span className="text-xl font-black text-blue-600">{processed.toLocaleString()}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-[#101622] p-4 rounded-xl border border-gray-100 dark:border-[#2a3441]">
                                    <span className="text-xs text-gray-400 block mb-1">Depósito</span>
                                    <span className="text-sm font-bold text-[#0d121b] dark:text-white truncate block" title={deposito}>
                                        {deposito}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStatus('idle')}
                                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                                Cargar otro archivo
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center justify-center text-center py-8">
                            <div className="size-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
                                <AlertCircle size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-[#0d121b] dark:text-white mb-2">Error en la importación</h2>
                            <p className="text-red-600 dark:text-red-400 text-sm mb-8 font-medium">
                                {message}
                            </p>

                            <button
                                onClick={() => {
                                    setStatus('idle');
                                    // Keep form data, allowing user to correct or retry
                                }}
                                className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-xl font-bold transition-all"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}
                </div>

                {/* Info Footer */}
                <div className="bg-gray-50 dark:bg-[#101622]/50 p-6 border-t border-[#e7ebf3] dark:border-[#2a3441] flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Información de Seguridad</h4>
                        <p className="text-xs text-[#4c669a] dark:text-gray-400 leading-relaxed">
                            Este proceso actualiza los precios y el stock teórico de todos los productos del depósito seleccionado.
                            Asegúrate de que la fecha corresponda a la generada en el sistema de origen.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

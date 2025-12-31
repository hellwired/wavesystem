'use client';

import { useState } from 'react';
import { processSupplierFile } from '../../actions/import';
import { Loader2, UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await processSupplierFile(formData);
            setResult(res);
        } catch (error) {
            setResult({ success: false, message: 'Ocurrió un error inesperado.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/ventapos/dashboard" className="text-neutral-500 hover:text-emerald-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </Link>
                        <span className="text-sm font-medium text-blue-500 uppercase tracking-wider">Administración</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Actualización de Precios</h1>
                    <p className="text-neutral-500">Carga el archivo del proveedor (.xls / .dbf) para sincronizar precios automáticamente.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 flex flex-col items-center justify-center">
                        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
                            <label className={`
                                flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-neutral-500'}
                            `}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploading ? (
                                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                                    ) : file ? (
                                        <FileSpreadsheet className="w-12 h-12 text-emerald-500 mb-4" />
                                    ) : (
                                        <UploadCloud className="w-12 h-12 text-neutral-400 mb-4" />
                                    )}

                                    <p className="mb-2 text-sm text-neutral-400">
                                        <span className="font-semibold">{file ? file.name : 'Haz clic para subir'}</span>
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Soporta archivos .xls (DBF Legacy)'}
                                    </p>
                                </div>
                                <input type="file" className="hidden" accept=".xls,.dbf" onChange={handleFileChange} disabled={uploading} />
                            </label>

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    'Iniciar Actualización'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results Card */}
                    {result && (
                        <div className={`border rounded-xl p-8 ${result.success ? 'bg-emerald-950/20 border-emerald-900' : 'bg-red-950/20 border-red-900'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                {result.success ? (
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                )}
                                <h3 className="text-xl font-bold text-white">
                                    {result.success ? 'Proceso Completado' : 'Error en el Proceso'}
                                </h3>
                            </div>

                            {result.success && result.stats && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-neutral-950 p-4 rounded-lg">
                                            <p className="text-sm text-neutral-500">Procesados</p>
                                            <p className="text-2xl font-bold text-white">{result.stats.processed.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-neutral-950 p-4 rounded-lg">
                                            <p className="text-sm text-neutral-500">Actualizados</p>
                                            <p className="text-2xl font-bold text-emerald-400">{result.stats.updated.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-neutral-950 p-4 rounded-lg">
                                            <p className="text-sm text-neutral-500">Coincidencias</p>
                                            <p className="text-2xl font-bold text-blue-400">{result.stats.matched.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-neutral-950 p-4 rounded-lg">
                                            <p className="text-sm text-neutral-500">Errores</p>
                                            <p className="text-2xl font-bold text-red-400">{result.stats.errors.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-800">
                                        <p className="text-sm font-medium text-neutral-400 mb-2">Detalle de Coincidencias:</p>
                                        <ul className="text-sm space-y-1 text-neutral-500">
                                            {result.stats.details?.byBarcode > 0 && <li>• Por Código de Barras: {result.stats.details.byBarcode}</li>}
                                            {result.stats.details?.byCodeCodbar > 0 && <li>• Por Código Interno (Sist.): {result.stats.details.byCodeCodbar}</li>}
                                            {result.stats.details?.byCodeCodigo > 0 && <li>• Por ID Proveedor: {result.stats.details.byCodeCodigo}</li>}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {!result.success && (
                                <p className="text-red-400">{result.message}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

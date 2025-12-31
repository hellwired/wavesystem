'use client';

import React, { useState } from 'react';
import { saveFinding } from '@/app/actions/auditoria';
import { uploadFile } from '@/app/actions/upload';

interface FindingModalProps {
    conteoId: number;
    initialNotes?: string;
    onClose: () => void;
}

export default function FindingModal({ conteoId, initialNotes = '', onClose }: FindingModalProps) {
    const [notes, setNotes] = useState(initialNotes);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('conteo_id', conteoId.toString());
        formData.append('notas', notes);

        try {
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);
                const fileUrl = await uploadFile(uploadFormData);
                if (fileUrl) {
                    formData.append('evidencia_url', fileUrl);
                }
            }

            await saveFinding(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error al guardar hallazgo');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-[#e7ebf3] dark:border-[#2a3441] flex justify-between items-center">
                    <h3 className="font-bold text-[#0d121b] dark:text-white">Registrar Hallazgo</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Observaciones / Daños</span>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="h-32 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-gray-50 dark:bg-[#101622] p-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
                            placeholder="Describe el problema encontrado..."
                            autoFocus
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Evidencia Fotográfica</span>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                dark:file:bg-blue-900/30 dark:file:text-blue-200
                            "
                        />
                        {selectedFile && (
                            <p className="text-xs text-green-600 mt-1">Imagen seleccionada: {selectedFile.name}</p>
                        )}
                    </label>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>}
                            {isSubmitting ? 'Guardando...' : 'Guardar Hallazgo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

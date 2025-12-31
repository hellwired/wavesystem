'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAuditoria, updateAuditoria } from '@/app/actions/auditoria';

interface AuditActionsProps {
    auditId: number;
    currentDescription: string;
    // Add other fields if needed for editing
}

export default function AuditActions({ auditId, currentDescription }: AuditActionsProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editForm, setEditForm] = useState({ descripcion: currentDescription });
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta auditoría? Esta acción no se puede deshacer.')) return;

        setIsDeleting(true);
        try {
            await deleteAuditoria(auditId);
            // Router refresh is handled by revalidatePath in action, but we might want to close menu
            setShowMenu(false);
        } catch (error) {
            alert('Error al eliminar auditoría');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();
        formData.append('descripcion', editForm.descripcion);
        // Add other fields if extended

        try {
            await updateAuditoria(auditId, formData);
            setShowEditModal(false);
            setShowMenu(false);
        } catch (error) {
            alert('Error al actualizar auditoría');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-[#4c669a] transition-colors"
            >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#1a2230] rounded-lg shadow-lg border border-[#e7ebf3] dark:border-[#2a3441] overflow-hidden z-20 py-1">
                        <button
                            onClick={() => { setShowEditModal(true); setShowMenu(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-[#0d121b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                </>
            )}

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-[#e7ebf3] dark:border-[#2a3441] flex justify-between items-center">
                            <h3 className="font-bold text-[#0d121b] dark:text-white">Editar Auditoría</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-4 flex flex-col gap-4">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Descripción</span>
                                <input
                                    type="text"
                                    value={editForm.descripcion}
                                    onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                                    className="h-10 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-gray-50 dark:bg-[#101622] px-3 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                                />
                            </label>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

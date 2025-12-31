"use client";

import React, { useState } from "react";
import { createChecklist, Checklist } from "@/app/actions/auditoria";

const categories = ["Todas", "Seguridad", "Equipos", "Operaciones", "Limpieza"];

export default function ChecklistManager({ initialChecklists }: { initialChecklists: Checklist[] }) {
    const [checklists, setChecklists] = useState(initialChecklists);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [showBuilder, setShowBuilder] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const filteredChecklists = checklists.filter(
        (c) => selectedCategory === "Todas" || c.categoria === selectedCategory
    );

    const handleCreateChecklist = async (formData: FormData) => {
        setIsSaving(true);
        try {
            await createChecklist(formData);
            setShowBuilder(false);
            // Ideally we would re-fetch or optimistically update, but revalidatePath in action handles the refresh
        } catch (error) {
            console.error("Error creating checklist", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestor de Checklists</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cree y administre las listas de verificación.</p>
                </div>
                <button
                    onClick={() => setShowBuilder(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all text-sm font-bold"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span> Nuevo Checklist
                </button>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat
                            ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 dark:bg-[#1a2230] dark:text-gray-400 dark:border-[#2a3441] dark:hover:bg-gray-800"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Checklists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChecklists.map((checklist) => (
                    <div key={checklist.id} className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] hover:shadow-md transition-shadow group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${checklist.categoria === "Seguridad" ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                    checklist.categoria === "Equipos" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" :
                                        checklist.categoria === "Operaciones" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                                            "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                    }`}>
                                    <span className="material-symbols-outlined text-xl">fact_check</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Editar">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20" title="Eliminar">
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{checklist.titulo}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{checklist.descripcion}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span> {checklist.questions || 0} items</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">history</span> {checklist.lastUsed || 'Nunca'}</span>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">play_arrow</span> Iniciar
                                </button>
                                <button className="flex-1 py-2 border border-gray-200 dark:border-[#2a3441] text-gray-600 dark:text-gray-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 dark:bg-[#101622]/50 border-t border-gray-100 dark:border-[#2a3441] rounded-b-xl flex justify-between items-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${checklist.estado === "activo" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                }`}>
                                {checklist.estado === "activo" ? "Activo" : "Borrador"}
                            </span>
                            <span className="text-xs text-gray-400">ID: #{checklist.id}</span>
                        </div>
                    </div>
                ))}

                {/* Add New Card (Visual cue) */}
                <button
                    onClick={() => setShowBuilder(true)}
                    className="border-2 border-dashed border-gray-200 dark:border-[#2a3441] rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors min-h-[280px]"
                >
                    <div className="p-4 bg-gray-50 dark:bg-[#101622] rounded-full mb-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <span className="material-symbols-outlined text-2xl">add</span>
                    </div>
                    <span className="font-medium">Crear Nuevo Checklist</span>
                </button>
            </div>

            {/* Simple Builder Modal/Overlay */}
            {showBuilder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <form action={handleCreateChecklist}>
                            <div className="p-6 border-b border-gray-100 dark:border-[#2a3441] flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Nuevo Checklist</h2>
                                <button type="button" onClick={() => setShowBuilder(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                                    <input name="titulo" type="text" className="w-full px-4 py-2 border border-gray-200 dark:border-[#2a3441] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-[#101622] text-gray-800 dark:text-white" placeholder="Ej: Auditoría de Pasillo 1" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                    <textarea name="descripcion" className="w-full px-4 py-2 border border-gray-200 dark:border-[#2a3441] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-[#101622] text-gray-800 dark:text-white" rows={3} placeholder="Describe el propósito de este checklist..." required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                                    <select name="categoria" className="w-full px-4 py-2 border border-gray-200 dark:border-[#2a3441] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-[#101622] text-gray-800 dark:text-white">
                                        <option value="Seguridad">Seguridad</option>
                                        <option value="Operaciones">Operaciones</option>
                                        <option value="Limpieza">Limpieza</option>
                                        <option value="Equipos">Equipos</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-[#101622]/50 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowBuilder(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">Cancelar</button>
                                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                                    {isSaving ? 'Guardando...' : 'Guardar Checklist'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

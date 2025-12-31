'use client';

import React, { useState, useEffect } from 'react';
import { createUsuario, updateUsuario, Usuario } from '@/app/actions/usuarios';
import { X, Save, Key, User, Shield, Loader2 } from 'lucide-react';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userToEdit?: Usuario | null;
}

export default function UserModal({ isOpen, onClose, onSuccess, userToEdit }: UserModalProps) {
    const [formData, setFormData] = useState({
        username: '',
        nombre: '',
        rol: 'auditor',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setFormData({
                    username: userToEdit.username,
                    nombre: userToEdit.nombre,
                    rol: userToEdit.rol,
                    password: '' // Don't show password on edit
                });
            } else {
                setFormData({
                    username: '',
                    nombre: '',
                    rol: 'auditor',
                    password: ''
                });
            }
            setError('');
        }
    }, [isOpen, userToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let result;
            if (userToEdit) {
                result = await updateUsuario(userToEdit.id, formData);
            } else {
                result = await createUsuario(formData);
            }

            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-[#e7ebf3] dark:border-[#2a3441]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2a3441] flex justify-between items-center bg-gray-50 dark:bg-[#101622]/50">
                    <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">
                        {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h3>
                    <button onClick={onClose} className="text-[#4c669a] hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#0d121b] dark:text-white mb-1.5">Nombre Completo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c669a]">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                required
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#101622] border border-[#e7ebf3] dark:border-[#2a3441] rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#0d121b] dark:text-white mb-1.5">Usuario (Login)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c669a]">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#101622] border border-[#e7ebf3] dark:border-[#2a3441] rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                                placeholder="Ej. jperez"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#0d121b] dark:text-white mb-1.5">Rol</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c669a]">
                                <Shield size={18} />
                            </span>
                            <select
                                value={formData.rol}
                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#101622] border border-[#e7ebf3] dark:border-[#2a3441] rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white appearance-none"
                            >
                                <option value="auditor">Auditor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#0d121b] dark:text-white mb-1.5">
                            {userToEdit ? 'Contraseña (Dejar en blanco para mantener)' : 'Contraseña'}
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c669a]">
                                <Key size={18} />
                            </span>
                            <input
                                type="password"
                                required={!userToEdit}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#101622] border border-[#e7ebf3] dark:border-[#2a3441] rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                                placeholder="********"
                                minLength={4}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-4 border-t border-[#e7ebf3] dark:border-[#2a3441]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-[#4c669a] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

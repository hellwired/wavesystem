'use client';

import React, { useState } from 'react';
import { Usuario, deleteUsuario } from '@/app/actions/usuarios';
import { Plus, Edit2, Trash2, Search, User, ShieldCheck, Shield } from 'lucide-react';
import UserModal from './UserModal';

export default function UserList({ initialUsers }: { initialUsers: Usuario[] }) {
    const [users, setUsers] = useState<Usuario[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

    // Filter users locally for immediate feedback
    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: Usuario) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

        const result = await deleteUsuario(id);
        if (result.success) {
            // Optimistic update (or just rely on revalidatePath via server action + router refresh, 
            // but manual state update is faster for UI)
            // The server action calls revalidatePath, but in a client component we might need to router.refresh() 
            // to fetch new data if we rely solely on props. 
            // However, for simplicity, we can just trigger a reload or trust the parent if it was real-time using context.
            // Actually, since this is a client component receiving props from server, 
            // after a server action mutation, Next.js 13+ usually handles refreshing server components.
            // BUT, to be sure, we can also update local state if we want instant feedback without waiting for reload.
            // Let's use router.refresh() pattern usually. But for now I'll trust standard Next.js behavior.
            // Actually, window.location.reload() is heavy.
            // Best practice: use `useRouter` and `router.refresh()`.
            setUsers(prev => prev.filter(u => u.id !== id));
        } else {
            alert(result.message);
        }
    };

    const handleSuccess = async () => {
        // In a real app we'd call router.refresh() here to re-run the server component logic
        // and get fresh data. For this MVP I'll reload the page to ensure sync.
        window.location.reload();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c669a]">
                        <Search size={20} />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1a2230] border border-[#e7ebf3] dark:border-[#2a3441] rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-[#4c669a] dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Usuario</th>
                                <th className="px-6 py-4 font-semibold">Nombre</th>
                                <th className="px-6 py-4 font-semibold">Rol</th>
                                <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7ebf3] dark:divide-[#2a3441]">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <User size={16} />
                                                </div>
                                                <span className="font-medium text-[#0d121b] dark:text-white">
                                                    {user.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">
                                            {user.nombre}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.rol === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                }`}>
                                                {user.rol === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                                                {user.rol === 'admin' ? 'Administrador' : 'Auditor'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#4c669a] dark:text-gray-500">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                userToEdit={selectedUser}
            />
        </div>
    );
}

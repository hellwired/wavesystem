'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Key } from 'lucide-react';
import Link from 'next/link';

interface UserFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function UserForm({ initialData, isEditing = false }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialData?.role || 'user');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: any = {
            name,
            email,
            role
        };

        if (password) {
            payload.password = password;
        }

        try {
            const url = isEditing
                ? `/next/api/users/${initialData.id}`
                : '/next/api/users';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al guardar');
            }

            router.push('/articulos-del-sur/admin/users');
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Error al guardar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/articulos-del-sur/admin/users"
                    className="flex items-center text-gray-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Volver
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                            placeholder="juan@ejemplo.com"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Rol</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                        >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Key size={16} /> Password {isEditing && <span className="text-gray-400 font-normal text-xs">(Dejar en blanco para no cambiar)</span>}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!isEditing}
                            minLength={6}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                            placeholder={isEditing ? '******' : 'Ingresa contraseña segura'}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

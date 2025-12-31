'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/next/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            const res = await fetch('/next/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });

            if (res.ok) {
                setNewName('');
                setIsCreating(false);
                fetchCategories();
            }
        } catch (error) {
            alert('Error creating category');
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editName.trim()) return;

        try {
            const res = await fetch(`/next/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName })
            });

            if (res.ok) {
                setEditingId(null);
                fetchCategories();
            }
        } catch (error) {
            alert('Error updating category');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro?')) return;

        try {
            const res = await fetch(`/next/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.message || 'Error al eliminar');
            }
        } catch (error) {
            alert('Error deleting category');
        }
    };

    const startEditing = (cat: Category) => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Categorías</h1>
                    <p className="text-gray-500">Gestiona las categorías de productos</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                    <Plus size={20} /> Nueva Categoría
                </button>
            </div>

            {isCreating && (
                <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                    <form onSubmit={handleCreate} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Categoría</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                placeholder="Ej. Electrónica"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="bg-gray-100 text-gray-500 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 size={32} className="animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold text-sm">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Nombre</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-400">#{cat.id}</td>
                                    <td className="p-4 font-medium text-slate-900">
                                        {editingId === cat.id ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="px-3 py-1 border rounded-lg outline-none focus:border-orange-500"
                                                />
                                                <button onClick={() => handleUpdate(cat.id)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            cat.name
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEditing(cat)}
                                                className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

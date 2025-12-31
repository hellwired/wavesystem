'use client';

import { useState } from 'react';
import { createTurno, updateTurno, deleteTurno } from '@/app/actions/turnos_admin';
import { useFormStatus } from 'react-dom';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50">
            {pending ? 'Guardando...' : label}
        </button>
    );
}

export default function TurnoListClient({ turnos }: { turnos: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTurno, setEditingTurno] = useState<any | null>(null);
    const [message, setMessage] = useState('');

    const openNew = () => {
        setEditingTurno(null);
        setMessage('');
        setIsModalOpen(true);
    };

    const openEdit = (turno: any) => {
        setEditingTurno(turno);
        setMessage('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Seguro que deseas eliminar este turno?')) {
            const res = await deleteTurno(id);
            if (!res.success) alert(res.message);
        }
    };

    async function handleFormAction(formData: FormData) {
        if (editingTurno) {
            formData.append('id', editingTurno.id);
            const res = await updateTurno(null, formData);
            if (res.success) setIsModalOpen(false);
            else setMessage(res.message);
        } else {
            const res = await createTurno(null, formData);
            if (res.success) setIsModalOpen(false);
            else setMessage(res.message);
        }
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Horarios Disponibles</h3>
                <button onClick={openNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-sm">
                    + Nuevo Turno
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entrada</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salida</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tolerancia</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {turnos.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{t.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.hora_entrada}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.hora_salida}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.margen_tolerancia_minutos} min</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEdit(t)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">{editingTurno ? 'Editar Turno' : 'Nuevo Turno'}</h2>

                        <form action={handleFormAction}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Nombre del Turno</label>
                                <input name="nombre" type="text" defaultValue={editingTurno?.nombre} className="w-full border p-2 rounded" placeholder="Ej: Mañana" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Entrada</label>
                                    <input name="hora_entrada" type="time" defaultValue={editingTurno?.hora_entrada} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Salida</label>
                                    <input name="hora_salida" type="time" defaultValue={editingTurno?.hora_salida} className="w-full border p-2 rounded" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Tolerancia (min)</label>
                                <input name="margen_tolerancia_minutos" type="number" defaultValue={editingTurno?.margen_tolerancia_minutos || 15} className="w-full border p-2 rounded" required />
                            </div>

                            {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <div className="w-32">
                                    <SubmitButton label={editingTurno ? "Actualizar" : "Crear"} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

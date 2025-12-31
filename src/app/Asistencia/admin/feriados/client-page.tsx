'use client';

import { useState } from 'react';
import { createFeriado, deleteFeriado } from '@/app/actions/feriados_admin';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
            {pending ? '...' : 'Agregar'}
        </button>
    );
}

export default function FeriadoListClient({ feriados }: { feriados: any[] }) {
    const [message, setMessage] = useState('');

    const handleDelete = async (fecha: string) => {
        // Convert generic date string to YYYY-MM-DD for consistency if needed, but table usually returns proper format
        // Simple confirm
        if (confirm('¿Eliminar este feriado?')) {
            const d = new Date(fecha).toISOString().split('T')[0];
            await deleteFeriado(d);
        }
    };

    async function handleCreate(formData: FormData) {
        const res = await createFeriado(null, formData);
        if (!res.success) setMessage(res.message);
        else setMessage('');
        // Reset form? usually server action revalidates, we can clear input via ref ideally or controlled
        // For simplicity in this stack, we rely on page refresh or reset
        const form = document.querySelector('form') as HTMLFormElement;
        form?.reset();
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulario de Alta */}
            <div className="bg-white p-6 rounded-lg shadow h-fit">
                <h3 className="text-lg font-bold mb-4">Nuevo Feriado</h3>
                <form action={handleCreate}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">Fecha</label>
                        <input name="fecha" type="date" className="w-full border p-2 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">Descripción</label>
                        <input name="descripcion" type="text" className="w-full border p-2 rounded" placeholder="Ej: Navidad" required />
                    </div>
                    {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
                    <SubmitButton />
                </form>
            </div>

            {/* Listado */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                            <th className="px-6 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {feriados.map((f) => (
                            <tr key={f.fecha} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {new Date(f.fecha).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.descripcion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button onClick={() => handleDelete(f.fecha)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

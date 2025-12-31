'use client';

import { useState } from 'react';
import { createEmpleado, updateEmpleado, deleteEmpleado } from '@/app/actions/empleados_admin';
import { useFormStatus } from 'react-dom';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50">
            {pending ? 'Guardando...' : label}
        </button>
    );
}

export default function EmpleadoListClient({ empleados, turnos }: { empleados: any[], turnos: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmp, setEditingEmp] = useState<any | null>(null);
    const [message, setMessage] = useState('');

    const openNew = () => {
        setEditingEmp(null);
        setMessage('');
        setIsModalOpen(true);
    };

    const openEdit = (emp: any) => {
        setEditingEmp(emp);
        setMessage('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Seguro que deseas desactivar este empleado?')) {
            await deleteEmpleado(id);
        }
    };

    async function handleFormAction(formData: FormData) {
        if (editingEmp) {
            // Update
            formData.append('id', editingEmp.id);
            const res = await updateEmpleado(null, formData);
            if (res.success) {
                setIsModalOpen(false);
            } else {
                setMessage(res.message);
            }
        } else {
            // Create
            const res = await createEmpleado(null, formData);
            if (res.success) {
                setIsModalOpen(false);
            } else {
                setMessage(res.message);
            }
        }
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Listado de Personal</h3>
                <button onClick={openNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-sm">
                    + Nuevo Empleado
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turno</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {empleados.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{emp.dni}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.apellidos}, {emp.nombres}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.nombre_turno || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {emp.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEdit(emp)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                    <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900">Desactivar</button>
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
                        <h2 className="text-xl font-bold mb-4">{editingEmp ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>

                        <form action={handleFormAction}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">DNI</label>
                                <input name="dni" type="text" defaultValue={editingEmp?.dni} className="w-full border p-2 rounded" required maxLength={15} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Nombres</label>
                                    <input name="nombres" type="text" defaultValue={editingEmp?.nombres} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Apellidos</label>
                                    <input name="apellidos" type="text" defaultValue={editingEmp?.apellidos} className="w-full border p-2 rounded" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Turno</label>
                                <select name="turno_id" defaultValue={editingEmp?.turno_id} className="w-full border p-2 rounded" required>
                                    <option value="">Seleccione...</option>
                                    {turnos.map(t => (
                                        <option key={t.id} value={t.id}>{t.nombre} ({t.hora_entrada} - {t.hora_salida})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="permite_horas_extras"
                                    name="permite_horas_extras"
                                    defaultChecked={editingEmp?.permite_horas_extras === 1}
                                    className="w-5 h-5"
                                />
                                <label htmlFor="permite_horas_extras" className="text-sm font-bold">Permite Realizar Horas Extras</label>
                            </div>

                            {editingEmp && (
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1">Estado</label>
                                    <select name="estado" defaultValue={editingEmp?.estado} className="w-full border p-2 rounded">
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            )}

                            {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <div className="w-32">
                                    <SubmitButton label={editingEmp ? "Actualizar" : "Crear"} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

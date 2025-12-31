import { getEmpleados, getTurnos } from '@/app/actions/empleados_admin';
import Link from 'next/link';
import EmpleadoListClient from './client-page'; // Separating client logic

export default async function EmpleadosPage() {
    const empleados = await getEmpleados();
    const turnos = await getTurnos();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/Asistencia/admin/dashboard" className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                            ← Volver
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Empleados</h1>
                    </div>
                </div>

                <EmpleadoListClient empleados={empleados} turnos={turnos} />
            </div>
        </div>
    );
}

import { getAsistenciaLogs, logoutUser } from '@/app/actions/asistencia_admin';
import DeleteLogButton from './DeleteLogButton';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('asistencia_admin_session');

    if (!session) {
        redirect('/Asistencia/admin');
    }

    const logs = await getAsistenciaLogs();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800">Panel de Control - Asistencia</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/Asistencia/admin/empleados" className="text-blue-600 hover:text-blue-800 font-medium">
                            Empleados
                        </Link>
                        <Link href="/Asistencia/admin/turnos" className="text-blue-600 hover:text-blue-800 font-medium">
                            Turnos
                        </Link>
                        <Link href="/Asistencia/admin/feriados" className="text-blue-600 hover:text-blue-800 font-medium">
                            Feriados
                        </Link>
                        <Link href="/Asistencia/admin/reportes" className="text-blue-600 hover:text-blue-800 font-medium">
                            Reportes
                        </Link>
                        <Link href="/Asistencia/admin/auditoria" className="text-blue-600 hover:text-blue-800 font-medium">
                            Auditoría
                        </Link>
                        <form action={logoutUser}>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>

                {/* Stats Summary (Placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm">Registros Hoy</p>
                        <p className="text-2xl font-bold">{logs.filter((l: any) => new Date(l.fecha).toDateString() === new Date().toDateString()).length}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Presentes</p>
                        <p className="text-2xl font-bold">-</p>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Últimos Movimientos</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(log.fecha).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{log.nombres} {log.apellidos}</span>
                                                <span className="text-xs text-gray-500">DNI: {log.dni}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.turno || 'General'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                            {log.entrada}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                            {log.salida || (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Activo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {log.es_hora_extra ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    Hora Extra
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${log.estado_asistencia === 'puntual' ? 'bg-green-100 text-green-800' :
                                                        log.estado_asistencia === 'tarde' ? 'bg-yellow-100 text-yellow-800' :
                                                            log.estado_asistencia === 'ausente' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {log.estado_asistencia.charAt(0).toUpperCase() + log.estado_asistencia.slice(1)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <DeleteLogButton id={log.id} />
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-sm">
                                            No hay registros recientes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

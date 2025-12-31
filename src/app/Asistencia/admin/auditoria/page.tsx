import pool from '@/lib/db_asistencia';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getAuditLogs() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT a.id, a.fecha_hora, a.tipo_intento, a.motivo, e.nombres, e.apellidos, e.dni
            FROM auditoria_accesos a
            LEFT JOIN empleados e ON a.empleado_id = e.id
            ORDER BY a.created_at DESC
            LIMIT 100
        `);
        return rows;
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }
}

export default async function AuditoriaPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('asistencia_admin_session');

    if (!session) {
        redirect('/Asistencia/admin');
    }

    const logs = await getAuditLogs();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white p-4 shadow-sm rounded mb-6 flex items-center justify-between">
                    <div>
                        <Link href="/Asistencia/admin/dashboard" className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-2 transition-colors">
                            &larr; Volver al Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">Auditoría de Accesos Rechazados</h1>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha (ARG)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo de Rechazo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                        {new Date(log.fecha_hora).toLocaleDateString('es-AR', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit', second: '2-digit',
                                            timeZone: 'America/Argentina/Buenos_Aires'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{log.nombres} {log.apellidos}</div>
                                        <div className="text-xs text-gray-500">{log.dni}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.tipo_intento === 'entrada' ? 'bg-green-100 text-green-800' :
                                            log.tipo_intento === 'salida' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {log.tipo_intento.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-red-600 font-medium">
                                        {log.motivo}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        No hay registros de intentos fallidos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

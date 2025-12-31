import { NextResponse } from 'next/server';
import pool from '@/lib/db_asistencia';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

export async function GET() {
    let connection;
    try {
        connection = await pool.getConnection();
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // 1. Buscar sesiones abiertas de hoy
        // Join con turnos para saber hora de salida
        // Join con empleados para saber si permite extras
        const [sesionesAbiertas] = await connection.execute<RowDataPacket[]>(`
            SELECT a.id, a.empleado_id, t.hora_salida, e.permite_horas_extras
            FROM asistencias a
            JOIN empleados e ON a.empleado_id = e.id
            JOIN turnos t ON e.turno_id = t.id
            WHERE a.fecha = ? 
            AND a.hora_salida IS NULL
            AND e.estado = 'activo'
        `, [today]);

        let cerradas = 0;

        for (const sesion of sesionesAbiertas) {
            // Si no tiene hora de salida definida en turno, ignoramos (o manejamos default)
            if (!sesion.hora_salida) continue;

            const [h, m, s] = sesion.hora_salida.split(':').map(Number);
            const turnoSalida = new Date(now);
            turnoSalida.setHours(h, m, s || 0, 0);

            // Limite: Hora Salida + 30 min
            const limiteCierre = new Date(turnoSalida.getTime() + 30 * 60000);

            // Si ya pasó el límite y NO permite extras -> CERRAR
            if (now > limiteCierre && sesion.permite_horas_extras !== 1) {
                await connection.execute(`
                    UPDATE asistencias 
                    SET hora_salida = ?, 
                        estado_asistencia = 'no_marco_salida',
                        comentario = CONCAT(IFNULL(comentario, ''), ' [Cierre Automático: No marcó salida]')
                    WHERE id = ?
                `, [sesion.hora_salida, sesion.id]); // Se cierra con la hora teórica de salida
                cerradas++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Proceso completado. Sesiones cerradas: ${cerradas}`,
            timestamp: now.toISOString()
        });

    } catch (error: any) {
        console.error('Error en cron cierre asistencias:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

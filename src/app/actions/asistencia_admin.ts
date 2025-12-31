'use server';

import pool from '@/lib/db_asistencia';
import { RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function authenticateUser(formData: FormData) {
    const user = formData.get('username') as string;
    const pass = formData.get('password') as string;

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, usuario, rol FROM usuarios_sistema WHERE usuario = ? AND password = ?', // En producción usar bcrypt
            [user, pass]
        );

        if (rows.length > 0) {
            // Login exitoso
            (await cookies()).set('asistencia_admin_session', 'true', { maxAge: 60 * 60 * 24 }); // 1 día
            return { success: true };
        } else {
            return { success: false, message: 'Credenciales inválidas' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Error de servidor' };
    }
}

export async function logoutUser() {
    (await cookies()).delete('asistencia_admin_session');
    redirect('/Asistencia/admin');
}

export async function getAsistenciaLogs() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        a.id,
        a.fecha,
        e.nombres,
        e.apellidos,
        e.dni,
        t.nombre as turno,
        DATE_FORMAT(a.hora_entrada, '%H:%i:%s') as entrada,
        DATE_FORMAT(a.hora_salida, '%H:%i:%s') as salida,
        a.estado_asistencia,
        a.es_hora_extra
      FROM asistencias a
      JOIN empleados e ON a.empleado_id = e.id
      LEFT JOIN turnos t ON e.turno_id = t.id
      ORDER BY a.fecha DESC, a.hora_entrada DESC
      LIMIT 100
    `);
        return rows;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

export async function deleteAsistenciaLog(id: number) {
    const session = (await cookies()).get('asistencia_admin_session');
    if (!session) {
        return { success: false, message: 'No autorizado' };
    }

    try {
        await pool.execute('DELETE FROM asistencias WHERE id = ?', [id]);
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, message: 'Error al eliminar el registro' };
    }
}

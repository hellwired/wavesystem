'use server';

import pool from '@/lib/db_asistencia';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

export async function getEmpleados() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT e.*, t.nombre as nombre_turno 
      FROM empleados e 
      LEFT JOIN turnos t ON e.turno_id = t.id 
      ORDER BY e.apellidos, e.nombres
    `);
        return rows;
    } catch (error) {
        console.error('Error fetching empleados:', error);
        return [];
    }
}

export async function getTurnos() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM turnos ORDER BY nombre');
        return rows;
    } catch (error) {
        console.error('Error fetching turnos:', error);
        return [];
    }
}

export async function createEmpleado(currentState: any, formData: FormData) {
    const dni = formData.get('dni') as string;
    const nombres = formData.get('nombres') as string;
    const apellidos = formData.get('apellidos') as string;
    const turno_id = formData.get('turno_id') as string;
    const permite_ot = formData.get('permite_horas_extras') === 'on' ? 1 : 0;

    try {
        await pool.execute<ResultSetHeader>(
            'INSERT INTO empleados (dni, nombres, apellidos, turno_id, estado, permite_horas_extras) VALUES (?, ?, ?, ?, "activo", ?)',
            [dni, nombres, apellidos, turno_id, permite_ot]
        );
        revalidatePath('/Asistencia/admin/empleados');
        return { success: true, message: 'Empleado creado correctamente.' };
    } catch (error: any) {
        console.error('Error creating empleado:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'El DNI ya existe.' };
        }
        return { success: false, message: 'Error al crear empleado.' };
    }
}

export async function updateEmpleado(currentState: any, formData: FormData) {
    const id = formData.get('id') as string;
    const dni = formData.get('dni') as string;
    const nombres = formData.get('nombres') as string;
    const apellidos = formData.get('apellidos') as string;
    const turno_id = formData.get('turno_id') as string;
    const estado = formData.get('estado') as string;
    const permite_ot = formData.get('permite_horas_extras') === 'on' ? 1 : 0;

    try {
        await pool.execute(
            'UPDATE empleados SET dni=?, nombres=?, apellidos=?, turno_id=?, estado=?, permite_horas_extras=? WHERE id=?',
            [dni, nombres, apellidos, turno_id, estado, permite_ot, id]
        );
        revalidatePath('/Asistencia/admin/empleados');
        return { success: true, message: 'Empleado actualizado.' };
    } catch (error) {
        console.error('Error updating empleado:', error);
        return { success: false, message: 'Error al actualizar.' };
    }
}

export async function deleteEmpleado(id: number) {
    try {
        // Soft delete preferido
        await pool.execute('UPDATE empleados SET estado="inactivo" WHERE id=?', [id]);
        revalidatePath('/Asistencia/admin/empleados');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Error al eliminar.' };
    }
}

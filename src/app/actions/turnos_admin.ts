'use server';

import pool from '@/lib/db_asistencia';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

export async function getTurnosAdmin() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM turnos ORDER BY nombre');
        return rows;
    } catch (error) {
        console.error('Error fetching turnos:', error);
        return [];
    }
}

export async function createTurno(currentState: any, formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const hora_entrada = formData.get('hora_entrada') as string;
    const hora_salida = formData.get('hora_salida') as string;
    const margen = formData.get('margen_tolerancia_minutos') as string;

    try {
        await pool.execute<ResultSetHeader>(
            'INSERT INTO turnos (nombre, hora_entrada, hora_salida, margen_tolerancia_minutos) VALUES (?, ?, ?, ?)',
            [nombre, hora_entrada, hora_salida, margen]
        );
        revalidatePath('/Asistencia/admin/turnos');
        return { success: true, message: 'Turno creado correctamente.' };
    } catch (error) {
        console.error('Error creating turno:', error);
        return { success: false, message: 'Error al crear turno.' };
    }
}

export async function updateTurno(currentState: any, formData: FormData) {
    const id = formData.get('id') as string;
    const nombre = formData.get('nombre') as string;
    const hora_entrada = formData.get('hora_entrada') as string;
    const hora_salida = formData.get('hora_salida') as string;
    const margen = formData.get('margen_tolerancia_minutos') as string;

    try {
        await pool.execute(
            'UPDATE turnos SET nombre=?, hora_entrada=?, hora_salida=?, margen_tolerancia_minutos=? WHERE id=?',
            [nombre, hora_entrada, hora_salida, margen, id]
        );
        revalidatePath('/Asistencia/admin/turnos');
        return { success: true, message: 'Turno actualizado.' };
    } catch (error) {
        console.error('Error updating turno:', error);
        return { success: false, message: 'Error al actualizar.' };
    }
}

export async function deleteTurno(id: number) {
    try {
        // Check usage
        const [usage] = await pool.execute<RowDataPacket[]>('SELECT id FROM empleados WHERE turno_id = ? LIMIT 1', [id]);
        if (usage.length > 0) {
            return { success: false, message: 'No se puede eliminar: Hay empleados asignados a este turno.' };
        }

        await pool.execute('DELETE FROM turnos WHERE id=?', [id]);
        revalidatePath('/Asistencia/admin/turnos');
        revalidatePath('/Asistencia/admin/empleados');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Error al eliminar.' };
    }
}

'use server';

import pool from '@/lib/db_asistencia';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

export async function getFeriados() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM feriados ORDER BY fecha DESC');
        return rows;
    } catch (error) {
        console.error('Error fetching feriados:', error);
        return [];
    }
}

export async function createFeriado(currentState: any, formData: FormData) {
    const fecha = formData.get('fecha') as string;
    const descripcion = formData.get('descripcion') as string;

    try {
        await pool.execute<ResultSetHeader>(
            'INSERT INTO feriados (fecha, descripcion) VALUES (?, ?)',
            [fecha, descripcion]
        );
        revalidatePath('/Asistencia/admin/feriados');
        return { success: true, message: 'Feriado agregado.' };
    } catch (error: any) {
        console.error('Error creating feriado:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Ya existe un feriado en esa fecha.' };
        }
        return { success: false, message: 'Error al agregar feriado.' };
    }
}

export async function deleteFeriado(fecha: string) {
    try {
        const formattedDate = new Date(fecha).toISOString().split('T')[0]; // Ensure generic match? Actually SQL DATE string is YYYY-MM-DD
        await pool.execute('DELETE FROM feriados WHERE fecha = ?', [fecha]);
        revalidatePath('/Asistencia/admin/feriados');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Error al eliminar.' };
    }
}

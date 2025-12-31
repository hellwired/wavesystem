import { NextResponse } from 'next/server';
import pool from '@/lib/db_asistencia';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            ALTER TABLE asistencias 
            MODIFY COLUMN estado_asistencia 
            ENUM('puntual', 'tarde', 'ausente', 'horas_extras', 'no_marco_salida') 
            DEFAULT 'puntual'
        `);
        connection.release();
        return NextResponse.json({ success: true, message: 'Schema updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

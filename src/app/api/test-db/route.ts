import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
        const [products] = await connection.execute('SELECT * FROM products LIMIT 5');
        connection.release();

        return NextResponse.json({
            status: 'success',
            message: 'Connected to database',
            count: rows,
            sample: products
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

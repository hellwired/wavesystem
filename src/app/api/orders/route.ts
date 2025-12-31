import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const query = `
            SELECT o.*, u.name as user_name, u.email as user_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
        const [rows] = await pool.execute<RowDataPacket[]>(query);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
    }
}

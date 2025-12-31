import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET Order Detail with Items
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        // 1. Get Order info
        const [orders] = await pool.execute<RowDataPacket[]>(`
            SELECT o.*, u.name as user_name, u.email as user_email, u.phone, u.address, u.city
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [id]);

        if (orders.length === 0) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // 2. Get Items
        const [items] = await pool.execute<RowDataPacket[]>(`
            SELECT oi.*, p.name as product_name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [id]);

        return NextResponse.json({ ...orders[0], items });

    } catch (error) {
        console.error('Error fetching order detail:', error);
        return NextResponse.json({ message: 'Error fetching order' }, { status: 500 });
    }
}

// PUT Update Status
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { status } = await request.json();

        const [result] = await pool.execute<ResultSetHeader>(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order updated' });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
    }
}

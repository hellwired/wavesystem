import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { name, description, price, stock, category_id, image_url, is_featured, discount_percentage, is_offer, offer_expires_at } = body;

        const query = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?, is_featured = ?, discount_percentage = ?, is_offer = ?, offer_expires_at = ?
            WHERE id = ?
        `;

        const [result] = await pool.execute<ResultSetHeader>(query, [
            name, description, price, stock, category_id, image_url, is_featured ? 1 : 0, discount_percentage || 0, is_offer ? 1 : 0, offer_expires_at || null, id
        ]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const [result] = await pool.execute<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
    }
}

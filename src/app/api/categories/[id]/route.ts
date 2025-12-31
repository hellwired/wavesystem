import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }

        const [result] = await pool.execute<ResultSetHeader>('UPDATE categories SET name = ? WHERE id = ?', [name, id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ message: 'Error updating category' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Check if used in products
        const [products] = await pool.execute<RowDataPacket[]>('SELECT id FROM products WHERE category_id = ? LIMIT 1', [id]);
        if (products.length > 0) {
            return NextResponse.json({ message: 'Cannot delete category with associated products' }, { status: 400 });
        }

        const [result] = await pool.execute<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ message: 'Error deleting category' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';

// GET: Get single user
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [params.id]);
        if (rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
    }
}

// PUT: Update user
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { name, email, role, password } = body;

        // Condition to update password only if provided
        let query = 'UPDATE users SET name = ?, email = ?, role = ?';
        const queryParams = [name, email, role];

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            queryParams.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        queryParams.push(params.id);

        await pool.execute(query, queryParams);

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
}

// DELETE: Delete user
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [params.id]);
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // Get role ID
        const [roles]: any = await connection.query('SELECT id FROM roles WHERE name = ?', [role]);
        if (roles.length === 0) {
            connection.release();
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }
        const roleId = roles[0].id;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        try {
            await connection.query(
                'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, roleId]
            );
        } catch (err: any) {
            connection.release();
            if (err.code === 'ER_DUP_ENTRY') {
                return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
            }
            throw err;
        }

        connection.release();
        return NextResponse.json({ message: 'User registered successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

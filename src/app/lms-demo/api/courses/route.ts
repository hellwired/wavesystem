import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        const [courses] = await connection.query(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id
    `);
        connection.release();
        return NextResponse.json(courses);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromToken();
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description } = await request.json();
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        const [result]: any = await connection.query(
            'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)',
            [title, description, user.userId]
        );
        connection.release();

        return NextResponse.json({ id: result.insertId, title, description, instructor_id: user.userId });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

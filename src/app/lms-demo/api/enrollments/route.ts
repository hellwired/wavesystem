import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { course_id } = await request.json();
        if (!course_id) {
            return NextResponse.json({ error: 'Missing course_id' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // Check if already enrolled
        const [existing]: any = await connection.query(
            'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
            [user.userId, course_id]
        );

        if (existing.length > 0) {
            connection.release();
            return NextResponse.json({ message: 'Already enrolled' });
        }

        await connection.query(
            'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
            [user.userId, course_id]
        );
        connection.release();

        return NextResponse.json({ message: 'Enrolled successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const connection = await pool.getConnection();
        const [enrollments] = await connection.query(`
      SELECT e.*, c.title as course_title, c.description 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `, [user.userId]);
        connection.release();

        return NextResponse.json(enrollments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

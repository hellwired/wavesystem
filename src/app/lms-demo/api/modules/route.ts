import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromToken();
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { course_id, title, order_index } = await request.json();
        if (!course_id || !title) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // Verify course ownership
        const [courses]: any = await connection.query('SELECT instructor_id FROM courses WHERE id = ?', [course_id]);
        if (courses.length === 0) {
            connection.release();
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }
        if (user.role !== 'admin' && courses[0].instructor_id !== user.userId) {
            connection.release();
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [result]: any = await connection.query(
            'INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)',
            [course_id, title, order_index || 0]
        );
        connection.release();

        return NextResponse.json({ id: result.insertId, course_id, title, order_index });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

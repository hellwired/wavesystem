import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromToken();
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { module_id, title, type, url } = await request.json();
        if (!module_id || !title || !type) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // Verify module and course ownership
        const [modules]: any = await connection.query(`
      SELECT c.instructor_id 
      FROM modules m 
      JOIN courses c ON m.course_id = c.id 
      WHERE m.id = ?
    `, [module_id]);

        if (modules.length === 0) {
            connection.release();
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }
        if (user.role !== 'admin' && modules[0].instructor_id !== user.userId) {
            connection.release();
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [result]: any = await connection.query(
            'INSERT INTO resources (module_id, title, type, url) VALUES (?, ?, ?, ?)',
            [module_id, title, type, url]
        );
        connection.release();

        return NextResponse.json({ id: result.insertId, module_id, title, type, url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

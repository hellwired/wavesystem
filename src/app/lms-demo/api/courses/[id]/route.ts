import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const connection = await pool.getConnection();
        const [courses]: any = await connection.query(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ?
    `, [id]);

        if (courses.length === 0) {
            connection.release();
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Get modules
        const [modules]: any = await connection.query(`
      SELECT * FROM modules WHERE course_id = ? ORDER BY order_index
    `, [id]);

        // Get resources for these modules
        if (modules.length > 0) {
            const moduleIds = modules.map((m: any) => m.id);
            const [resources]: any = await connection.query(`
        SELECT * FROM resources WHERE module_id IN (?) ORDER BY id
      `, [moduleIds]);

            // Attach resources to modules
            modules.forEach((module: any) => {
                module.resources = resources.filter((r: any) => r.module_id === module.id);
            });
        }

        connection.release();
        return NextResponse.json({ ...courses[0], modules });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getUserFromToken();
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const connection = await pool.getConnection();
        await connection.query('DELETE FROM courses WHERE id = ?', [id]);
        connection.release();

        return NextResponse.json({ message: 'Course deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

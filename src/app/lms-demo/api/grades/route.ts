import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromToken();
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { enrollment_id, evaluation_id, score, feedback } = await request.json();

        const connection = await pool.getConnection();
        await connection.query(
            'INSERT INTO grades (enrollment_id, evaluation_id, score, feedback) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = ?, feedback = ?',
            [enrollment_id, evaluation_id, score, feedback, score, feedback]
        );
        connection.release();

        return NextResponse.json({ message: 'Grade submitted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

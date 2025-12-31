import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        try {
            // Check if column exists
            const [columns] = await connection.execute(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = '${process.env.DB_NAME_ARTICULOS || 'articulos_db'}' 
                AND TABLE_NAME = 'products' 
                AND COLUMN_NAME = 'offer_expires_at'
            `);

            const existingColumns = (columns as any[]).map(c => c.COLUMN_NAME);

            if (!existingColumns.includes('offer_expires_at')) {
                await connection.execute(`
                    ALTER TABLE products 
                    ADD COLUMN offer_expires_at DATETIME NULL
                `);
                return NextResponse.json({ success: true, message: 'Added offer_expires_at column' });
            }

            return NextResponse.json({ success: true, message: 'Schema already up to date' });

        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

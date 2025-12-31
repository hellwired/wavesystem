import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        try {
            // Check if columns exist
            const [columns] = await connection.execute(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = '${process.env.DB_NAME_ARTICULOS || 'articulos_db'}' 
                AND TABLE_NAME = 'products' 
                AND COLUMN_NAME IN ('discount_percentage', 'is_offer')
            `);

            const existingColumns = (columns as any[]).map(c => c.COLUMN_NAME);
            const messages = [];

            if (!existingColumns.includes('discount_percentage')) {
                await connection.execute(`
                    ALTER TABLE products 
                    ADD COLUMN discount_percentage INT DEFAULT 0
                `);
                messages.push('Added discount_percentage column');
            }

            if (!existingColumns.includes('is_offer')) {
                await connection.execute(`
                    ALTER TABLE products 
                    ADD COLUMN is_offer TINYINT(1) DEFAULT 0
                `);
                messages.push('Added is_offer column');
            }

            if (messages.length === 0) {
                return NextResponse.json({ success: true, message: 'Schema already up to date' });
            }

            return NextResponse.json({ success: true, message: 'Migration successful', details: messages });

        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

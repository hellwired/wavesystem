import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM categories ORDER BY name ASC');
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        if (!name) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }

        const [result] = await pool.execute<any>('INSERT INTO categories (name) VALUES (?)', [name]);

        return NextResponse.json({ id: result.insertId, name }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
    }
}

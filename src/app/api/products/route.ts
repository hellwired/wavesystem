import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET: List all products
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const offer = searchParams.get('offer');
        const category = searchParams.get('category'); // Can be ID or Name? Let's assume ID for robustness or handle both

        let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
        const params: any[] = [];
        const conditions: string[] = [];

        if (featured === 'true') {
            conditions.push('p.is_featured = 1');
        }

        if (offer === 'true') {
            conditions.push('p.is_offer = 1');
            conditions.push('(p.offer_expires_at IS NULL OR p.offer_expires_at >= CURDATE())');
        }

        if (category) {
            conditions.push('p.category_id = ?');
            params.push(category);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY p.created_at DESC';

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
    }
}

// POST: Create new product
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, stock, category_id, image_url, is_featured, discount_percentage, is_offer, offer_expires_at } = body;

        // Validation
        if (!name || !price) {
            return NextResponse.json({ message: 'Name and Price are required' }, { status: 400 });
        }

        const query = `
            INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured, discount_percentage, is_offer, offer_expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute<ResultSetHeader>(query, [
            name,
            description || '',
            price,
            stock || 0,
            category_id || null,
            image_url || null,
            is_featured ? 1 : 0,
            discount_percentage || 0,
            is_offer ? 1 : 0,
            offer_expires_at || null
        ]);

        return NextResponse.json({
            message: 'Product created successfully',
            id: result.insertId
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
    }
}

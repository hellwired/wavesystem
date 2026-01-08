import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET: List all products
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const offer = searchParams.get('offer');
        const category = searchParams.get('category');

        // Modificamos la query para sumar el stock de la tabla stock_depositos
        let query = `
            SELECT 
                p.*, 
                c.name as category_name,
                COALESCE(SUM(CASE WHEN sd.deposito_id = 1 THEN sd.cantidad ELSE 0 END), 0) as stock_deposito,
                COALESCE(SUM(CASE WHEN sd.deposito_id = 2 THEN sd.cantidad ELSE 0 END), 0) as stock_local,
                COALESCE(SUM(sd.cantidad), 0) as stock
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN stock_depositos sd ON p.id = sd.product_id
        `;

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

        // Agrupamos por ID de producto para que el SUM funcione correctamente
        query += ' GROUP BY p.id';
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

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Nota: Mantenemos el campo stock en products por compatibilidad legacy por ahora,
            // pero el valor real estará en stock_depositos.
            const queryProduct = `
                INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured, discount_percentage, is_offer, offer_expires_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await connection.execute<ResultSetHeader>(queryProduct, [
                name,
                description || '',
                price,
                stock || 0, // Legacy support
                category_id || null,
                image_url || null,
                is_featured ? 1 : 0,
                discount_percentage || 0,
                is_offer ? 1 : 0,
                offer_expires_at || null
            ]);

            const newProductId = result.insertId;
            const initialStock = stock || 0;

            // Insertar stock inicial en el Depósito Central (ID 1)
            if (initialStock > 0) {
                await connection.execute(
                    'INSERT INTO stock_depositos (product_id, deposito_id, cantidad) VALUES (?, ?, ?)',
                    [newProductId, 1, initialStock]
                );
            } else {
                // Aun si es 0, es bueno tener el registro
                await connection.execute(
                    'INSERT INTO stock_depositos (product_id, deposito_id, cantidad) VALUES (?, ?, ?)',
                    [newProductId, 1, 0]
                );
            }

            await connection.commit();

            return NextResponse.json({
                message: 'Product created successfully',
                id: newProductId
            }, { status: 201 });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
    }
}

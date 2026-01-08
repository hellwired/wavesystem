import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET SINGLE PRODUCT
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        // Obtenemos el producto y su stock total sumado de todos los depósitos
        const query = `
            SELECT 
                p.*, 
                COALESCE(SUM(sd.cantidad), 0) as stock
            FROM products p
            LEFT JOIN stock_depositos sd ON p.id = sd.product_id
            WHERE p.id = ?
            GROUP BY p.id
        `;
        const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { name, description, price, stock, category_id, image_url, is_featured, discount_percentage, is_offer, offer_expires_at } = body;

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const query = `
                UPDATE products 
                SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?, is_featured = ?, discount_percentage = ?, is_offer = ?, offer_expires_at = ?
                WHERE id = ?
            `;

            const [result] = await connection.execute<ResultSetHeader>(query, [
                name, description, price, stock, category_id, image_url, is_featured ? 1 : 0, discount_percentage || 0, is_offer ? 1 : 0, offer_expires_at || null, id
            ]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
            }

            // Actualizar stock en deposito central (ID 1) si se proporcionó un valor de stock
            // Usamos ON DUPLICATE KEY UPDATE para mayor seguridad si no existiera el registro
            if (stock !== undefined) {
                await connection.execute(
                    `INSERT INTO stock_depositos (product_id, deposito_id, cantidad) 
                     VALUES (?, 1, ?) 
                     ON DUPLICATE KEY UPDATE cantidad = VALUES(cantidad)`,
                    [id, stock]
                );
            }

            await connection.commit();
            return NextResponse.json({ message: 'Product updated successfully' });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const connection = await pool.getConnection(); // Use transaction for safety
        await connection.beginTransaction();

        try {
            // 1. Borrar stock relacionado (stock_depositos)
            await connection.execute('DELETE FROM stock_depositos WHERE product_id = ?', [id]);

            // 2. Borrar historial de transferencias (si existe tabla log)
            // await connection.execute('DELETE FROM stock_transfers_log WHERE product_id = ?', [id]);

            // 3. Borrar items de ordenes (Opcional: Si queremos borrar historial de ventas, o poner ON DELETE SET NULL)
            // Por ahora asumimos que si se borra el producto, se borra. Cuidado con integridad de ventas pasadas.
            // Si hay FK en order_items, fallará si hay ventas.

            // 4. Borrar movimientos de stock
            await connection.execute('DELETE FROM stock_movements WHERE product_id = ?', [id]);

            // 5. Finalmente borrar el producto
            const [result] = await connection.execute<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
            }

            await connection.commit();
            return NextResponse.json({ message: 'Product deleted successfully' });

        } catch (err) {
            await connection.rollback();
            // Check for specific FK constraint error
            if ((err as any).code === 'ER_ROW_IS_REFERENCED_2') {
                return NextResponse.json({ message: 'No se puede eliminar: El producto tiene ventas asociadas.' }, { status: 409 });
            }
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
    }
}

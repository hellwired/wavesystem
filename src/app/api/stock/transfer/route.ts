import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { product_id, from_deposito_id, to_deposito_id, quantity } = body;

        if (!product_id || !from_deposito_id || !to_deposito_id || !quantity) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const qty = Number(quantity);
        if (qty <= 0) {
            return NextResponse.json({ message: 'Quantity must be positive' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Verificar stock en origen
            const [sourceStock] = await connection.execute<RowDataPacket[]>(
                'SELECT cantidad FROM stock_depositos WHERE product_id = ? AND deposito_id = ? FOR UPDATE',
                [product_id, from_deposito_id]
            );

            if (sourceStock.length === 0 || sourceStock[0].cantidad < qty) {
                await connection.rollback();
                return NextResponse.json({ message: 'Insufficient stock in source deposit' }, { status: 400 });
            }

            // 2. Descontar de origen
            await connection.execute(
                'UPDATE stock_depositos SET cantidad = cantidad - ? WHERE product_id = ? AND deposito_id = ?',
                [qty, product_id, from_deposito_id]
            );

            // 3. Sumar a destino (Insertar si no existe)
            await connection.execute(
                `INSERT INTO stock_depositos (product_id, deposito_id, cantidad) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`,
                [product_id, to_deposito_id, qty]
            );

            // 4. Log de transferencia (Si existe la tabla, es opcional pero recomendado)
            try {
                await connection.execute(
                    'INSERT INTO stock_transfers_log (product_id, from_deposito_id, to_deposito_id, quantity) VALUES (?, ?, ?, ?)',
                    [product_id, from_deposito_id, to_deposito_id, qty]
                );
            } catch (ignore) {
                // Si la tabla de log no existe aun, no bloqueamos la transferencia
                console.warn('Logging transfer failed, log table might missing');
            }

            await connection.commit();
            return NextResponse.json({ message: 'Transfer successful' });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Transfer error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

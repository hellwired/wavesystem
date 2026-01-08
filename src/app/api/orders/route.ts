import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
    try {
        const query = `
            SELECT o.*, u.name as user_name, u.email as user_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
        const [rows] = await pool.execute<RowDataPacket[]>(query);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
    }
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    name: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, payment, total, userId } = body;
        // userId puede venir del front (si seleccionan un cliente) o usar un ID genérico para "Venta Mostrador" (ej. ID 2 que es el usuario actual, o ID 1 Admin)
        // Por defecto usaremos el usuario que hace la request si no se especifica. Asumiremos ID 2 (Claudio) para simplificar si no hay auth context complejo.
        const finalUserId = userId || 2;

        if (!items || items.length === 0) {
            return NextResponse.json({ message: 'No items in order' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Validar Stock en Local Uruguay (ID 2)
            for (const item of items) {
                const [rows] = await connection.execute<RowDataPacket[]>(
                    'SELECT cantidad FROM stock_depositos WHERE product_id = ? AND deposito_id = 2',
                    [item.id]
                );

                const currentStock = rows.length > 0 ? rows[0].cantidad : 0;
                if (currentStock < item.quantity) {
                    throw new Error(`Stock insuficiente en Local Uruguay para ${item.name}. Disponible: ${currentStock}`);
                }
            }

            // 2. Crear Orden
            const [orderResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO orders (user_id, total_amount, status, payment_method, installments, card_details) 
                 VALUES (?, ?, 'paid', ?, ?, ?)`,
                [
                    finalUserId,
                    total,
                    payment.method,
                    payment.installments || 1,
                    payment.card_details || null
                ]
            );
            const orderId = orderResult.insertId;

            // 3. Procesar Items y Stock
            for (const item of items) {
                // Insertar Order Item
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.id, item.quantity, item.price]
                );

                // Descontar Stock Local Uruguay (ID 2)
                await connection.execute(
                    'UPDATE stock_depositos SET cantidad = cantidad - ? WHERE product_id = ? AND deposito_id = 2',
                    [item.quantity, item.id]
                );

                // Registrar Movimiento (Salida por Venta)
                await connection.execute(
                    `INSERT INTO stock_movements (product_id, user_id, type, quantity, reason, deposito_id) 
                     VALUES (?, ?, 'out', ?, 'Venta POS #'?, 2)`,
                    [item.id, finalUserId, item.quantity, orderId] // reason concatenado
                );
            }

            await connection.commit();
            return NextResponse.json({ message: 'Sale completed successfully', orderId }, { status: 201 });

        } catch (error) {
            await connection.rollback();
            console.error('Transaction Error:', error);
            // Determinar si es error de stock para devolver 409 Conflict
            const errorMessage = (error as Error).message;
            if (errorMessage.includes('Stock insuficiente')) {
                return NextResponse.json({ message: errorMessage }, { status: 409 });
            }
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ message: 'Error processing sale' }, { status: 500 });
    }
}

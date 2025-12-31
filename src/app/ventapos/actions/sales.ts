'use server';

import pool from '@/lib/ventapos-db';
import { OrderSchema, Order, OrderItem, Payment } from '../schemas';
import { revalidatePath } from 'next/cache';

export async function createOrder(data: Order) {
    // Validate basic structure
    // Note: 'id' is generated, 'total' is re-calculated for security

    if (!data.items || data.items.length === 0) {
        return { success: false, error: 'No items in order' };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Validate Stock & Calculate Total
        let calculatedTotal = 0;

        for (const item of data.items) {
            // Check current stock and price
            const [rows] = await connection.query(
                `SELECT id, priceAtSale, stock, isService, salePrice FROM Products WHERE id = ? FOR UPDATE`,
                [item.productId]
            );
            // @ts-ignore
            const product = rows[0];

            if (!product) {
                throw new Error(`Product ID ${item.productId} not found`);
            }

            if (!product.isService && product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.productId}. Available: ${product.stock}`);
            }

            // Use server-side price for security, or validate client price
            // Prompt says "priceAtSale (histórico)", usually we take current price
            const price = Number(product.salePrice);
            calculatedTotal += price * item.quantity;

            // Update local item for insertion
            item.priceAtSale = price;
            item.subtotal = price * item.quantity;

            // 2. Deduct Stock
            if (!product.isService) {
                await connection.query(
                    `UPDATE Products SET stock = stock - ? WHERE id = ?`,
                    [item.quantity, item.productId]
                );

                // 3. Audit Log (Inventory)
                await connection.query(
                    `INSERT INTO InventoryLogs (productId, userId, type, quantity, reason)
           VALUES (?, ?, 'SALE', ?, 'Venta POS')`,
                    [item.productId, data.userId, -item.quantity]
                );
            }
        }

        // 4. Create Order
        const [orderRes] = await connection.query(
            `INSERT INTO Orders (sessionId, clientId, userId, total, status)
       VALUES (?, ?, ?, ?, 'COMPLETED')`,
            [data.sessionId, data.clientId || null, data.userId, calculatedTotal]
        );
        // @ts-ignore
        const orderId = orderRes.insertId;

        // 5. Create Order Items
        for (const item of data.items) {
            await connection.query(
                `INSERT INTO OrderItems (orderId, productId, quantity, priceAtSale, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.productId, item.quantity, item.priceAtSale, item.subtotal]
            );
        }

        // 6. Record Payments
        // Validate payment total matches order total?
        // For now assuming full payment or partial (if credit)
        const paymentTotal = data.payments.reduce((sum, p) => sum + p.amount, 0);
        // Warning: floating point math, but usually acceptable for simple checks, better use integer cents

        for (const payment of data.payments) {
            await connection.query(
                `INSERT INTO Payments (orderId, method, amount)
         VALUES (?, ?, ?)`,
                [orderId, payment.method, payment.amount]
            );
        }

        // Update Client Balance if Current Account?
        // Not explicitly in "Order" logic but implied by "CurrentAccountBalance". 
        // If method is CURRENT_ACCOUNT, update Client
        const currentAccountPayment = data.payments.find(p => p.method === 'CURRENT_ACCOUNT');
        if (currentAccountPayment && data.clientId) {
            await connection.query(
                `UPDATE Clients SET currentAccountBalance = currentAccountBalance + ? WHERE id = ?`,
                [currentAccountPayment.amount, data.clientId]
            );
            // Positive balance means debt? Or typically Debt is negative? 
            // Standard ERP: "Balance" > 0 usually means they owe us, or we owe them?
            // Let's assume Balance is "Amount Owed By Client" (Debt).
            // So buying on credit INCREASES balance. 
        }

        await connection.commit();
        revalidatePath('/ventapos');
        return { success: true, orderId };

    } catch (error: any) {
        await connection.rollback();
        console.error('Transaction Error:', error);
        return { success: false, error: error.message || 'Transaction failed' };
    } finally {
        connection.release();
    }
}

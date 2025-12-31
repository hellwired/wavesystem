'use server';

import pool from '@/lib/ventapos-db';
import { CashSession, CashMovement } from '../schemas';
import { revalidatePath } from 'next/cache';

// Helper to get active session for a specific user
export async function getActiveSession(userId: number) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM CashSessions WHERE userId = ? AND status = 'OPEN' LIMIT 1`,
            [userId]
        );
        const sessions = rows as CashSession[];
        return { success: true, data: sessions[0] || null };
    } catch (error) {
        console.error('Error fetching active session:', error);
        return { success: false, error: 'Failed to check active session' };
    }
}

export async function openSession(userId: number, cashRegisterId: number, openingAmount: number) {
    try {
        // Check if user already has an open session
        const active = await getActiveSession(userId);
        if (active.data) {
            return { success: false, error: 'User already has an active session' };
        }

        const [res] = await pool.query(
            `INSERT INTO CashSessions (userId, cashRegisterId, openingAmount, status, openedAt)
       VALUES (?, ?, ?, 'OPEN', NOW())`,
            [userId, cashRegisterId, openingAmount]
        );

        revalidatePath('/ventapos');
        // @ts-ignore
        return { success: true, sessionId: res.insertId };
    } catch (error) {
        console.error('Error opening session:', error);
        return { success: false, error: 'Failed to open session' };
    }
}

export async function closeSession(sessionId: number, closingAmount: number) {
    // Logic: 
    // 1. Calculate Expected Amount: Opening + Deposits - Withdrawals + Cash Sales
    // 2. Compare with Closing Amount
    // 3. Store difference and close

    try {
        // Get Opening & Movements
        const [sessionRows] = await pool.query(`SELECT openingAmount FROM CashSessions WHERE id = ?`, [sessionId]);
        // @ts-ignore
        const openingAmount = Number(sessionRows[0]?.openingAmount || 0);

        const [movements] = await pool.query(
            `SELECT type, amount FROM CashMovements WHERE sessionId = ?`,
            [sessionId]
        );
        // @ts-ignore
        const deposits = movements.filter(m => m.type === 'DEPOSIT').reduce((acc, m) => acc + Number(m.amount), 0);
        // @ts-ignore
        const withdrawals = movements.filter(m => m.type === 'WITHDRAWAL').reduce((acc, m) => acc + Number(m.amount), 0);

        // Get Cash Sales (Payments)
        // Join Orders and Payments
        const [salesRows] = await pool.query(
            `SELECT p.amount 
       FROM Payments p
       JOIN Orders o ON p.orderId = o.id
       WHERE o.sessionId = ? AND p.method = 'CASH' AND o.status = 'COMPLETED'`,
            [sessionId]
        );
        // @ts-ignore
        const cashSales = salesRows.reduce((acc, row) => acc + Number(row.amount), 0);

        const calculatedAmount = openingAmount + deposits - withdrawals + cashSales;
        const difference = closingAmount - calculatedAmount;

        await pool.query(
            `UPDATE CashSessions 
       SET closingAmount = ?, calculatedAmount = ?, difference = ?, status = 'CLOSED', closedAt = NOW()
       WHERE id = ?`,
            [closingAmount, calculatedAmount, difference, sessionId]
        );

        revalidatePath('/ventapos');
        return { success: true, summary: { calculatedAmount, difference } };

    } catch (error) {
        console.error('Error closing session:', error);
        return { success: false, error: 'Failed to close session' };
    }
}

export async function addCashMovement(sessionId: number, type: 'DEPOSIT' | 'WITHDRAWAL', amount: number, reason: string) {
    try {
        await pool.query(
            `INSERT INTO CashMovements (sessionId, type, amount, reason) VALUES (?, ?, ?, ?)`,
            [sessionId, type, amount, reason]
        );
        revalidatePath('/ventapos');
        return { success: true };
    } catch (error) {
        console.error('Error adding cash movement:', error);
        return { success: false, error: 'Failed to add movement' };
    }
}

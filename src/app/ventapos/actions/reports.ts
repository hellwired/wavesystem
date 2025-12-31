'use server';

import pool from '../../../lib/db'; // Adjust path if necessary, assuming standard db location
import { RowDataPacket } from 'mysql2';

// Types for report data
export type DailySales = {
    date: string;
    total: number;
    count: number;
};

export type TopProduct = {
    id: number;
    description: string;
    quantity: number;
    revenue: number;
};

export type PaymentStat = {
    method: string;
    total: number;
    count: number;
};

export type KPIData = {
    totalRevenue: number;
    totalOrders: number;
    averageTicket: number;
};

// 1. Get Sales Trend (Last 7 Days)
export async function getSalesLast7Days() {
    try {
        const sql = `
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                SUM(total) as total,
                COUNT(*) as count
            FROM orders
            WHERE status = 'COMPLETED'
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY date
            ORDER BY date ASC
        `;
        const [rows] = await pool.query<RowDataPacket[]>(sql);

        // Fill in missing days with 0 if needed (optional, simplistic version here)
        return { success: true, data: rows as DailySales[] };
    } catch (error) {
        console.error('Error fetching sales trend:', error);
        return { success: false, error: 'Failed to fetch sales trend' };
    }
}

// 2. Get Top Selling Products (Limit 5)
export async function getTopProducts(limit = 5) {
    try {
        const sql = `
            SELECT 
                p.id,
                p.description,
                SUM(oi.quantity) as quantity,
                SUM(oi.subtotal) as revenue
            FROM order_items oi
            JOIN products p ON oi.productId = p.id
            JOIN orders o ON oi.orderId = o.id
            WHERE o.status = 'COMPLETED'
            GROUP BY p.id, p.description
            ORDER BY quantity DESC
            LIMIT ?
        `;
        const [rows] = await pool.query<RowDataPacket[]>(sql, [limit]);
        return { success: true, data: rows as TopProduct[] };
    } catch (error) {
        console.error('Error fetching top products:', error);
        return { success: false, error: 'Failed to fetch top products' };
    }
}

// 3. Get Payment Method Distribution
export async function getPaymentStats() {
    try {
        const sql = `
            SELECT 
                method,
                SUM(amount) as total,
                COUNT(*) as count
            FROM payments
            GROUP BY method
            ORDER BY total DESC
        `;
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        return { success: true, data: rows as PaymentStat[] };
    } catch (error) {
        console.error('Error fetching payment stats:', error);
        return { success: false, error: 'Failed to fetch payment stats' };
    }
}

// 4. Get Global KPIs (Today)
export async function getTodaysKPIs() {
    try {
        const sql = `
            SELECT 
                SUM(total) as totalRevenue,
                COUNT(*) as totalOrders,
                AVG(total) as averageTicket
            FROM orders
            WHERE status = 'COMPLETED'
            AND DATE(created_at) = CURDATE()
        `;
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        const kpi = rows[0] as KPIData;

        return {
            success: true,
            data: {
                totalRevenue: Number(kpi.totalRevenue || 0),
                totalOrders: Number(kpi.totalOrders || 0),
                averageTicket: Number(kpi.averageTicket || 0)
            }
        };
    } catch (error) {
        console.error('Error fetching KPIs:', error);
        return { success: false, error: 'Failed to fetch KPIs' };
    }
}

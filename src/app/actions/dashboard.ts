'use server';

import pool from '@/lib/db_logistica';
import { RowDataPacket } from 'mysql2';

export interface DashboardStats {
    inventory: {
        totalProducts: number;
        lowStock: number;
        totalValue: number;
    };
    orders: {
        pending: number;
        today: number;
        deliveredToday: number;
    };
    transport: {
        activeRoutes: number;
        availableMotos: number;
    };
    returns: {
        pending: number;
    };
}

export async function getDashboardStats() {
    // Run queries in parallel for performance
    const todo = [
        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM productos'),
        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM productos WHERE stock <= punto_reorden'),
        pool.query<RowDataPacket[]>('SELECT SUM(stock * precio_min) as v FROM productos'),

        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM pedidos WHERE estado = "pendiente"'),
        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM pedidos WHERE DATE(fecha) = CURRENT_DATE'),
        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM pedidos WHERE estado = "entregado" AND DATE(fecha) = CURRENT_DATE'),

        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM rutas WHERE estado = "en_curso"'),
        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM motos WHERE estado = "disponible"'),

        pool.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM devoluciones WHERE estado = "pendiente"')
    ];

    const results = await Promise.all(todo);

    // Helper to safe get count
    const getCount = (res: any) => res[0][0]?.c || 0;
    const getValue = (res: any) => parseFloat(res[0][0]?.v || 0);

    return {
        inventory: {
            totalProducts: getCount(results[0]),
            lowStock: getCount(results[1]),
            totalValue: getValue(results[2]),
        },
        orders: {
            pending: getCount(results[3]),
            today: getCount(results[4]),
            deliveredToday: getCount(results[5]),
        },
        transport: {
            activeRoutes: getCount(results[6]),
            availableMotos: getCount(results[7]),
        },
        returns: {
            pending: getCount(results[8]),
        }
    } as DashboardStats;
}

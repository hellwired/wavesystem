'use server';

import pool from '@/lib/db_logistica';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

// --- Types ---

export interface Route {
    id: number;
    moto_id: number;
    moto_nombre?: string;
    moto_patente?: string;
    fecha: Date;
    estado: 'planificada' | 'en_curso' | 'completada' | 'cancelada';
    km_estimados: number;
    stops_count?: number;
}

export interface RouteStop {
    id: number;
    ruta_id: number;
    pedido_id: number;
    secuencia: number;
    estado: string;
    cliente?: string;
    direccion?: string;
    lat?: number;
    lng?: number; // In real app, these come from geocoding
}

// --- TMS Actions ---

export async function getRoutes() {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT r.*, m.nombre as moto_nombre, m.patente as moto_patente,
        (SELECT COUNT(*) FROM paradas_ruta pr WHERE pr.ruta_id = r.id) as stops_count
        FROM rutas r
        JOIN motos m ON r.moto_id = m.id
        ORDER BY r.fecha DESC, r.id DESC
    `);
    return rows as Route[];
}

export async function getRouteDetails(routeId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT pr.*, p.cliente, p.direccion 
        FROM paradas_ruta pr
        JOIN pedidos p ON pr.pedido_id = p.id
        WHERE pr.ruta_id = ?
        ORDER BY pr.secuencia ASC
    `, [routeId]);
    return rows as RouteStop[];
}

export async function getPendingOrders() {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM pedidos WHERE estado = "pendiente" ORDER BY fecha ASC'
    );
    return rows; // Returns raw orders
}

export async function getAvailableMotos() {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT m.* FROM motos m WHERE m.estado = "disponible"'
    );
    return rows;
}

/**
 * Simple Route Builder (Heuristic)
 * Creates a route for a selected moto with selected orders.
 * In a real scenario, this would attempt to sort by distance (TSP).
 */
export async function createRoute(formData: FormData) {
    const motoId = parseInt(formData.get('moto_id') as string);
    const orderIds = (formData.get('order_ids') as string).split(',').map(Number);
    const fecha = new Date(); // Today

    if (orderIds.length === 0) return;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Create Route Header
        const [res] = await connection.query<ResultSetHeader>(
            'INSERT INTO rutas (moto_id, fecha, estado, km_estimados) VALUES (?, ?, "planificada", 0)',
            [motoId, fecha]
        );
        const routeId = res.insertId;

        // 2. Assign orders to Route (Stops)
        // Simple sequence: same as array order
        let secuencia = 1;
        for (const orderId of orderIds) {
            await connection.query(
                'INSERT INTO paradas_ruta (ruta_id, pedido_id, secuencia, estado) VALUES (?, ?, ?, "pendiente")',
                [routeId, orderId, secuencia]
            );

            // Update Order Status to 'planificado'
            await connection.query(
                'UPDATE pedidos SET estado = "planificado" WHERE id = ?',
                [orderId]
            );
            secuencia++;
        }

        // 3. Mark Moto as In Use (Optional logic, maybe keep available until route starts)
        // await connection.query('UPDATE motos SET estado = "en_viaje" WHERE id = ?', [motoId]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    revalidatePath('/logistica/rutas');
    revalidatePath('/logistica/pedidos');
}

export async function startRoute(routeId: number) {
    await pool.query('UPDATE rutas SET estado = "en_curso", fecha_inicio = NOW() WHERE id = ?', [routeId]);
    // Also update order statuses? Usually driver does pick up scanning
    revalidatePath('/logistica/rutas');
}

// --- Driver Mobile Actions ---

export async function getDriverCurrentRoute(userId: number) {
    // 1. Find moto for user
    const [motos] = await pool.query<RowDataPacket[]>('SELECT id FROM motos WHERE usuario_id = ?', [userId]);
    if (motos.length === 0) return null;
    const motoId = motos[0].id;

    // 2. Find active route (planificada or en_curso)
    const [routes] = await pool.query<RowDataPacket[]>(`
        SELECT * FROM rutas 
        WHERE moto_id = ? AND estado IN ('planificada', 'en_curso')
        ORDER BY fecha ASC LIMIT 1
    `, [motoId]);

    if (routes.length === 0) return null;
    const route = routes[0] as Route;

    // 3. Get Stops with Order details
    const [stops] = await pool.query<RowDataPacket[]>(`
        SELECT pr.*, p.cliente, p.direccion, p.estado as pedido_estado
        FROM paradas_ruta pr
        JOIN pedidos p ON pr.pedido_id = p.id
        WHERE pr.ruta_id = ?
        ORDER BY pr.secuencia ASC
    `, [route.id]);

    return { ...route, stops: stops as RouteStop[] };
}

export async function updateStopStatus(stopId: number, status: 'entregado' | 'no_entregado', notes?: string) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Update Stop
        await connection.query(
            'UPDATE paradas_ruta SET estado = ?, notas = ?, hora_real = NOW() WHERE id = ?',
            [status, notes || '', stopId]
        );

        // 2. Get Order ID from Stop
        const [stops] = await connection.query<RowDataPacket[]>('SELECT pedido_id FROM paradas_ruta WHERE id = ?', [stopId]);
        if (stops.length > 0) {
            const orderId = stops[0].pedido_id;
            // 3. Update Order Status
            const orderStatus = status === 'entregado' ? 'entregado' : 'cancelado'; // Simplified
            await connection.query('UPDATE pedidos SET estado = ? WHERE id = ?', [orderStatus, orderId]);
        }

        await connection.commit();
    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
    revalidatePath('/logistica/chofer');
}


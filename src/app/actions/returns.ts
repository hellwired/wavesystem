'use server';

import pool from '@/lib/db_logistica';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

// --- Types ---

export interface ReturnRequest {
    id: number;
    pedido_id: number;
    cliente: string;
    fecha_solicitud: Date;
    motivo: string;
    estado: 'pendiente' | 'aprobada' | 'rechazada' | 'recibida' | 'completada';
    resolucion: 'reembolso' | 'cambio' | 'reparacion';
    items_count?: number;
}

// --- Actions ---

export async function getReturnRequests() {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT d.*, p.cliente, 
        (SELECT COUNT(*) FROM detalle_devolucion dd WHERE dd.devolucion_id = d.id) as items_count
        FROM devoluciones d
        JOIN pedidos p ON d.pedido_id = p.id
        ORDER BY d.fecha_solicitud DESC
    `);
    return rows as ReturnRequest[];
}

export async function createReturnRequest(formData: FormData) {
    const pedidoId = parseInt(formData.get('pedido_id') as string);
    const motivo = formData.get('motivo') as string;
    const resolucion = formData.get('resolucion') as string;
    // Simplified: Assuming selecting all items or just one generic item for MVP
    // In real app, would select specific order items. 
    // Here we will just create the header.

    const connection = await pool.getConnection();
    try {
        await connection.query(
            'INSERT INTO devoluciones (pedido_id, motivo, resolucion, estado) VALUES (?, ?, ?, "pendiente")',
            [pedidoId, motivo, resolucion]
        );
    } finally {
        connection.release();
    }
    revalidatePath('/logistica/devoluciones');
}

export async function processReturn(returnId: number, action: 'approve' | 'reject' | 'receive') {
    let newState = '';
    if (action === 'approve') newState = 'aprobada';
    if (action === 'reject') newState = 'rechazada'; // Final state
    if (action === 'receive') newState = 'recibida'; // Goods back in warehouse

    await pool.query('UPDATE devoluciones SET estado = ? WHERE id = ?', [newState, returnId]);

    // If received, logic to add stock back would go here (interacting with inventory tables)
    // For MVP, just status update.

    revalidatePath('/logistica/devoluciones');
}

export async function getDeliveredOrders() {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, cliente, fecha FROM pedidos WHERE estado = "entregado" ORDER BY fecha DESC LIMIT 50'
    );
    return rows;
}

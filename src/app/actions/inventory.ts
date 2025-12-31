'use server';

import pool from '@/lib/db_logistica';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

// --- Types ---
export interface InventoryItem {
    id: number;
    producto_id: number;
    nombre_producto: string;
    sku: string;
    ubicacion_id: number;
    codigo_ubicacion: string;
    cantidad: number;
    lote: string;
    fecha_vencimiento: Date | null;
}

// --- Actions ---

/**
 * Receive stock into a specific location
 */
export async function receiveStock(formData: FormData) {
    const productoId = parseInt(formData.get('producto_id') as string);
    const ubicacionId = parseInt(formData.get('ubicacion_id') as string);
    const cantidad = parseInt(formData.get('cantidad') as string);
    const lote = (formData.get('lote') as string) || '';
    const fechaVencimiento = (formData.get('fecha_vencimiento') as string) || null;
    const usuarioId = 1; // Default admin user for demo

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Add to Inventory
        await connection.query(
            'INSERT INTO inventario (producto_id, ubicacion_id, cantidad, lote, fecha_vencimiento) VALUES (?, ?, ?, ?, ?)',
            [productoId, ubicacionId, cantidad, lote, fechaVencimiento]
        );

        // 2. Update Product Total Stock
        await connection.query(
            'UPDATE productos SET stock = stock + ? WHERE id = ?',
            [cantidad, productoId]
        );

        // 3. Log Movement
        await connection.query(
            'INSERT INTO movimientos_stock (producto_id, tipo, cantidad, ubicacion_destino_id, usuario_id, referencia) VALUES (?, "entrada", ?, ?, ?, ?)',
            [productoId, cantidad, ubicacionId, usuarioId, `Lote: ${lote}`]
        );

        // 4. Update Location occupancy status (simplified: if has items, it's occupied)
        await connection.query('UPDATE ubicaciones SET ocupado = TRUE WHERE id = ?', [ubicacionId]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    revalidatePath('/logistica/inventario');
    revalidatePath('/logistica/productos');
}

/**
 * Get current detailed inventory
 */
export async function getInventory() {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT i.*, p.producto as nombre_producto, p.sku, u.codigo as codigo_ubicacion 
        FROM inventario i
        JOIN productos p ON i.producto_id = p.id
        JOIN ubicaciones u ON i.ubicacion_id = u.id
        ORDER BY i.fecha_ingreso DESC
    `);
    return rows as InventoryItem[];
}

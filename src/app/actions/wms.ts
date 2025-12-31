'use server';

import pool from '@/lib/db_logistica';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

// --- Types ---

export interface Warehouse {
    id: number;
    nombre: string;
    direccion: string;
    capacidad_total: number;
    activo: boolean;
}

export interface Location {
    id: number;
    almacen_id: number;
    codigo: string;
    pasillo: string;
    estanteria: string;
    altura: string;
    tipo: 'picking' | 'almacenamiento' | 'recepcion' | 'despacho';
    capacidad_max_peso: number;
    ocupado: boolean;
}

// --- Warehouses CRUD ---

export async function getWarehouses() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM almacenes WHERE activo = TRUE');
    return rows as Warehouse[];
}

export async function createWarehouse(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const direccion = formData.get('direccion') as string;
    const capacidad = parseFloat(formData.get('capacidad') as string) || 0;

    await pool.query(
        'INSERT INTO almacenes (nombre, direccion, capacidad_total) VALUES (?, ?, ?)',
        [nombre, direccion, capacidad]
    );
    revalidatePath('/logistica/almacen');
}

export async function getWarehouseById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM almacenes WHERE id = ?', [id]);
    return rows.length > 0 ? (rows[0] as Warehouse) : null;
}

// --- Locations CRUD ---

export async function getLocations(warehouseId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM ubicaciones WHERE almacen_id = ? ORDER BY pasillo, estanteria, altura',
        [warehouseId]
    );
    return rows as Location[];
}

export async function createLocation(formData: FormData) {
    const almacenId = parseInt(formData.get('almacen_id') as string);
    const codigo = formData.get('codigo') as string;
    const pasillo = formData.get('pasillo') as string;
    const estanteria = formData.get('estanteria') as string;
    const altura = formData.get('altura') as string;
    const tipo = formData.get('tipo') as string;
    const capacidad = parseFloat(formData.get('capacidad') as string) || 0;

    // Auto-generate code if empty: P-AA-E-01-A-01
    const finalCode = codigo || `${pasillo}-${estanteria}-${altura}`;

    await pool.query(
        'INSERT INTO ubicaciones (almacen_id, codigo, pasillo, estanteria, altura, tipo, capacidad_max_peso) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [almacenId, finalCode, pasillo, estanteria, altura, tipo, capacidad]
    );
    revalidatePath(`/logistica/almacen/${almacenId}`);
}

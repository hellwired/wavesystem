'use server';

import pool from '@/lib/ventapos-db';
import { ClientSchema, Client } from '../schemas';
import { revalidatePath } from 'next/cache';

export async function getClients(query?: string) {
    try {
        let sql = `SELECT * FROM Clients WHERE isActive = TRUE`;
        const params: any[] = [];

        if (query) {
            sql += ` AND (name LIKE ? OR cuit LIKE ? OR phone LIKE ?)`;
            params.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }

        sql += ` ORDER BY name ASC`;

        const [rows] = await pool.query(sql, params);
        return { success: true, data: rows as Client[] };
    } catch (error) {
        console.error('Error fetching clients:', error);
        return { success: false, error: 'Failed to fetch clients' };
    }
}

export async function createClient(data: Client) {
    const result = ClientSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: result.error.flatten() };
    }

    const { name, cuit, address, phone, email, currentAccountBalance } = result.data;

    try {
        const [res] = await pool.query(
            `INSERT INTO Clients (name, cuit, address, phone, email, currentAccountBalance)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [name, cuit, address, phone, email, currentAccountBalance]
        );
        revalidatePath('/ventapos');
        // @ts-ignore
        return { success: true, id: res.insertId };
    } catch (error) {
        console.error('Error creating client:', error);
        return { success: false, error: 'Failed to create client' };
    }
}

export async function updateClient(id: number, data: Partial<Client>) {
    try {
        const fields = [];
        const values = [];

        if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
        if (data.cuit !== undefined) { fields.push('cuit = ?'); values.push(data.cuit); }
        if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }
        if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone); }
        if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }

        if (fields.length === 0) return { success: false, error: 'No fields to update' };

        values.push(id);

        await pool.query(
            `UPDATE Clients SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        revalidatePath('/ventapos');
        return { success: true };
    } catch (error) {
        console.error('Error updating client:', error);
        return { success: false, error: 'Failed to update client' };
    }
}

export async function deleteClient(id: number) {
    try {
        // Soft Delete
        await pool.query(
            `UPDATE Clients SET isActive = FALSE, deletedAt = NOW() WHERE id = ?`,
            [id]
        );
        revalidatePath('/ventapos');
        return { success: true };
    } catch (error) {
        console.error('Error deleting client:', error);
        return { success: false, error: 'Failed to delete client' };
    }
}

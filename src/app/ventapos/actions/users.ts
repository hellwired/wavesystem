'use server';

import pool from '../../../lib/db';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

export type User = {
    id: number;
    username: string;
    role: 'ADMIN' | 'MANAGER' | 'AUXILIARY' | 'CASHIER';
    isActive: boolean;
    createdAt: Date;
};

// Get all users
export async function getUsers() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, username, role, isActive, createdAt FROM Users ORDER BY id DESC');
        return { success: true, data: rows as User[] };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, error: 'Error fetching users' };
    }
}

// Create new user
export async function createUser(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!username || !password || !role) {
        return { success: false, error: 'Todos los campos son obligatorios' };
    }

    try {
        const passwordHash = await hash(password, 10);

        await pool.query(
            'INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, passwordHash, role]
        );

        revalidatePath('/ventapos/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error('Error creating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, error: 'El nombre de usuario ya existe' };
        }
        return { success: false, error: 'Error al crear usuario' };
    }
}

// Toggle user status
export async function toggleUserStatus(userId: number, isActive: boolean) {
    try {
        await pool.query('UPDATE Users SET isActive = ? WHERE id = ?', [isActive, userId]);
        revalidatePath('/ventapos/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, error: 'Error updating user' };
    }
}

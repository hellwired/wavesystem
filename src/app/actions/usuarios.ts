'use server';

import poolAuditoria from '@/lib/db_auditoria';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

export interface Usuario {
    id: number;
    username: string;
    nombre: string;
    rol: 'admin' | 'auditor';
    created_at?: string;
}

export async function getUsuarios(): Promise<Usuario[]> {
    try {
        const [rows] = await poolAuditoria.query('SELECT id, username, nombre, rol, created_at FROM usuarios ORDER BY nombre ASC');
        return rows as Usuario[];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function createUsuario(data: { username: string; nombre: string; rol: string; password?: string }) {
    if (!data.password) {
        return { success: false, message: 'La contraseña es obligatoria para nuevos usuarios.' };
    }

    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await poolAuditoria.query(
            'INSERT INTO usuarios (username, nombre, rol, password_hash) VALUES (?, ?, ?, ?)',
            [data.username, data.nombre, data.rol, hashedPassword]
        );
        revalidatePath('/AuditoriaDepoStock/usuarios');
        return { success: true, message: 'Usuario creado exitosamente.' };
    } catch (error: any) {
        console.error('Error creating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'El nombre de usuario ya existe.' };
        }
        return { success: false, message: 'Error al crear el usuario.' };
    }
}

export async function updateUsuario(id: number, data: { username: string; nombre: string; rol: string; password?: string }) {
    try {
        if (data.password && data.password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await poolAuditoria.query(
                'UPDATE usuarios SET username = ?, nombre = ?, rol = ?, password_hash = ? WHERE id = ?',
                [data.username, data.nombre, data.rol, hashedPassword, id]
            );
        } else {
            await poolAuditoria.query(
                'UPDATE usuarios SET username = ?, nombre = ?, rol = ? WHERE id = ?',
                [data.username, data.nombre, data.rol, id]
            );
        }
        revalidatePath('/AuditoriaDepoStock/usuarios');
        return { success: true, message: 'Usuario actualizado exitosamente.' };
    } catch (error: any) {
        console.error('Error updating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'El nombre de usuario ya existe.' };
        }
        return { success: false, message: 'Error al actualizar el usuario.' };
    }
}

export async function deleteUsuario(id: number) {
    try {
        await poolAuditoria.query('DELETE FROM usuarios WHERE id = ?', [id]);
        revalidatePath('/AuditoriaDepoStock/usuarios');
        return { success: true, message: 'Usuario eliminado exitosamente.' };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Error al eliminar el usuario.' };
    }
}

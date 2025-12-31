'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import pool from '@/lib/db_auditoria';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'wavesystem-fallback-secret-2025');
const COOKIE_NAME = 'auditoria_session';

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return { error: 'Usuario y contraseña son requeridos' };
    }

    try {
        // Fetch user
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM usuarios WHERE username = ?',
            [username]
        );

        const user = rows[0];

        if (!user) {
            return { error: 'Credenciales inválidas' };
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return { error: 'Credenciales inválidas' };
        }

        // Create JWT
        const token = await new SignJWT({
            id: user.id,
            username: user.username,
            rol: user.rol,
            nombre: user.nombre
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(SECRET_KEY);

        // Set cookie
        (await cookies()).set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

    } catch (error) {
        console.error('Login error:', error);
        return { error: `Error interno: ${error instanceof Error ? error.message : String(error)}` };
    }

    redirect('/AuditoriaDepoStock');
}

export async function logout() {
    (await cookies()).delete(COOKIE_NAME);
    redirect('/AuditoriaDepoStock/login');
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token.value, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createInitialUser() {
    // Helper to create admin user if not exists
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            'INSERT IGNORE INTO usuarios (username, password_hash, nombre, rol) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, 'Administrador', 'admin']
        );
        console.log('Initial user check/creation completed.');
    } catch (error) {
        console.error('Error creating initial user:', error);
    }
}

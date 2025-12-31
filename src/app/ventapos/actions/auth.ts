'use server';

import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import pool from '@/lib/ventapos-db'; // Adjust path based on location
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'wavesystem-fallback-secret-2025');

const LoginSchema = z.object({
    username: z.string().min(1, 'Usuario requerido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

export async function loginAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const result = LoginSchema.safeParse(data);

    if (!result.success) {
        return { error: 'Datos inválidos' };
    }

    const { username, password } = result.data;

    let destination = null;

    try {
        const [rows] = await pool.query(
            'SELECT id, username, password_hash, role FROM Users WHERE username = ? AND isActive = TRUE LIMIT 1',
            [username]
        );
        const users = rows as any[];

        if (users.length === 0) {
            return { error: 'Credenciales inválidas' };
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return { error: 'Credenciales inválidas' };
        }

        // Create JWT
        const token = await new SignJWT({
            sub: user.id.toString(),
            username: user.username,
            role: user.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('12h') // 12 hour session
            .sign(SECRET_KEY);

        // Set Cookie
        (await cookies()).set('ventapos_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 12, // 12 hours
            path: '/',
        });

        // Determine redirect destination
        if (user.role === 'CASHIER') {
            destination = '/ventapos';
        } else {
            destination = '/ventapos/dashboard';
        }

    } catch (error: any) {
        console.error('Login error:', error);
        return { error: `Error detallado: ${error.message}` };
    }

    if (destination) {
        redirect(destination);
    }

}

export async function logoutAction() {
    (await cookies()).delete('ventapos_session');
    redirect('/ventapos/login');
}

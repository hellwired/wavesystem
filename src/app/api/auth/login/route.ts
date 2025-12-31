import { NextResponse } from 'next/server';
import pool from '@/lib/articulos-db';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email y contraseña requeridos' }, { status: 400 });
        }

        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const users = rows as any[];

        if (users.length === 0) {
            return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
        }

        const user = users[0];
        console.log(`User found: ${user.email} (ID: ${user.id}). Verification started.`);

        // Debugging hash comparison
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password check for ${user.email}: ${isPasswordValid ? 'MATCH' : 'FAIL'}`);

        if (!isPasswordValid) {
            console.log('Stored Hash start:', user.password.substring(0, 10));
            // WARNING: Do not log the plain password in production, only for this debug session
            // console.log('Received plain:', password); 
            return NextResponse.json({ message: 'Credenciales inválidas (Password mismatch)' }, { status: 401 });
        }

        // Create JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'wavesystem-fallback-secret-2025');
        const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        const response = NextResponse.json({ message: 'Login exitoso', user: { name: user.name, email: user.email, role: user.role } });

        // Set cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('CRITICAL LOGIN ERROR:', error);
        // Log specific properties if available
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({
            message: 'Error interno del servidor. Revisa los logs de PM2.',
            debug: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

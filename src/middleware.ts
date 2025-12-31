import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'wavesystem-fallback-secret-2025');

export async function middleware(request: NextRequest) {
    // AuditoriaDepoStock Protection
    if (request.nextUrl.pathname.startsWith('/AuditoriaDepoStock')) {
        // Allow access to login page and public assets if any
        if (request.nextUrl.pathname === '/AuditoriaDepoStock/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('auditoria_session');

        if (!token) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/AuditoriaDepoStock/login';
            return NextResponse.redirect(loginUrl);
        }

        try {
            await jwtVerify(token.value, SECRET_KEY);
            return NextResponse.next();
        } catch (error) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/AuditoriaDepoStock/login';
            return NextResponse.redirect(loginUrl);
        }
    }

    // Articulos del Sur Admin Protection
    if (request.nextUrl.pathname.startsWith('/articulos-del-sur/admin')) {
        const token = request.cookies.get('auth_token');
        console.log(`[Middleware] Checking admin access for: ${request.nextUrl.pathname}`);
        console.log(`[Middleware] Cookie 'auth_token' found: ${!!token}`);

        if (!token) {
            console.log('[Middleware] No token found. Redirecting to login.');
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/articulos-del-sur/login';
            return NextResponse.redirect(loginUrl);
        }

        try {
            await jwtVerify(token.value, SECRET_KEY);
            console.log('[Middleware] Token verified. Access granted.');
            return NextResponse.next();
        } catch (error) {
            console.error('[Middleware] Token verification failed:', error);
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/articulos-del-sur/login';
            return NextResponse.redirect(loginUrl);
        }
    }

    // VentaPOS Protection
    if (request.nextUrl.pathname.startsWith('/ventapos')) {
        if (request.nextUrl.pathname === '/ventapos/login') {
            // If already logged in, redirect to dashboard? Optional.
            return NextResponse.next();
        }

        const token = request.cookies.get('ventapos_session');

        if (!token) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/ventapos/login';
            return NextResponse.redirect(loginUrl);
        }

        try {
            await jwtVerify(token.value, SECRET_KEY);
            return NextResponse.next();
        } catch (error) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/ventapos/login';
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/AuditoriaDepoStock/:path*',
        '/articulos-del-sur/admin/:path*',
        '/ventapos/:path*',
    ],
};

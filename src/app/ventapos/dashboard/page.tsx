import Link from 'next/link';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import {
    Monitor,
    Package,
    Settings,
    BarChart3,
    LogOut,
    Users,
    History,
    UploadCloud
} from 'lucide-react';
import { logoutAction } from '../actions/auth';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'wavesystem-fallback-secret-2025');

async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('ventapos_session')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch {
        return null;
    }
}

export default async function DashboardPage() {
    const session = await getSession();
    const username = session?.username as string || 'Usuario';
    const role = session?.role as string || 'CASHIER';

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            {/* Header */}
            <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/20">
                            W
                        </div>
                        <span className="font-bold text-lg tracking-tight">Wavesystem VentaPOS</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-sm font-medium text-white">{username}</span>
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">{role}</span>
                        </div>
                        <form action={logoutAction}>
                            <button className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-red-400 transition-colors" title="Cerrar Sesión">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">Bienvenido al Panel de Control</h1>
                    <p className="text-neutral-400">Seleccione un módulo para continuar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Module: POS Terminal (Visible to ALL, though Cashiers redirect here directly) */}
                    <Link href="/ventapos" className="group relative overflow-hidden bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-900/10">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Monitor className="w-24 h-24 text-emerald-500" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                                <Monitor className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">Terminal de Venta</h2>
                            <p className="text-sm text-neutral-500 mb-6 flex-grow">
                                Acceder a la interfaz de facturación, control de caja y ventas rápidas.
                            </p>
                            <span className="text-sm font-medium text-emerald-500 flex items-center">
                                Ingresar <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </div>
                    </Link>

                    {/* Module: Products Admin (ADMIN, MANAGER, AUXILIARY) */}
                    {['ADMIN', 'MANAGER', 'AUXILIARY'].includes(role) && (
                        <Link href="/ventapos/admin/products" className="group relative overflow-hidden bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/10">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Package className="w-24 h-24 text-blue-500" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Package className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Productos</h2>
                                <p className="text-sm text-neutral-500 mb-6 flex-grow">
                                    Gestión de catálogo, precios, costos, stock y proveedores.
                                </p>
                                <span className="text-sm font-medium text-blue-500 flex items-center">
                                    Administrar <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Module: Reports (ADMIN, MANAGER) */}
                    {['ADMIN', 'MANAGER'].includes(role) && (
                        <Link href="/ventapos/reports" className="group relative overflow-hidden bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-900/10">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <BarChart3 className="w-24 h-24 text-purple-500" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Reportes</h2>
                                <p className="text-sm text-neutral-500 mb-6 flex-grow">
                                    Análisis de ingresos, tendencias y rendimiento de productos.
                                </p>
                                <span className="text-sm font-medium text-purple-500 flex items-center">
                                    Ver Métricas <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Module: Users (ADMIN ONLY) */}
                    {role === 'ADMIN' && (
                        <Link href="/ventapos/admin/users" className="group relative overflow-hidden bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-900/10">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users className="w-24 h-24 text-orange-500" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Usuarios</h2>
                                <p className="text-sm text-neutral-500 mb-6 flex-grow">
                                    Control de acceso, roles y permisos de empleados.
                                </p>
                                <span className="text-sm font-medium text-orange-500 flex items-center">
                                    Gestionar <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Module: Import Provider (ADMIN, MANAGER) */}
                    {['ADMIN', 'MANAGER'].includes(role) && (
                        <Link href="/ventapos/admin/import" className="group relative overflow-hidden bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-900/10">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <UploadCloud className="w-24 h-24 text-cyan-500" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Proveedor</h2>
                                <p className="text-sm text-neutral-500 mb-6 flex-grow">
                                    Carga masiva de listas de precios (DBF).
                                </p>
                                <span className="text-sm font-medium text-cyan-500 flex items-center">
                                    Importar <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            </main>
        </div>
    );
}

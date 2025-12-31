import { getSession, logout } from '@/app/actions/logistica';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function LogisticaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getSession();

    // If not logged in and not on login page, redirect (handled in middleware or page logic usually, 
    // but for this layout we can conditionally render sidebar)

    // Note: This layout wraps /logistica/* pages. 
    // If we are on /logistica/login, we might want to hide the sidebar.
    // Ideally, login page should be outside this layout or handle it differently.
    // For simplicity, we'll check if user exists.

    if (!user) {
        // If no user, we render children (which should be the login page if routing is correct, 
        // or we force redirect to login if trying to access protected routes)
        // However, Next.js Layouts persist. Let's assume this layout is for the dashboard area.
        // If we put login inside /logistica/login, it shares this layout.
        // We can conditionally render the sidebar.
    }

    return (
        <div className="min-h-screen flex bg-gray-100 text-gray-900">
            {user && (
                <aside className="w-64 bg-slate-800 text-white flex-shrink-0 hidden md:block">
                    <div className="p-4 border-b border-slate-700">
                        <h1 className="text-xl font-bold">Logistica</h1>
                        <p className="text-sm text-slate-400">Bienvenido, {user.username}</p>
                    </div>
                    <nav className="p-4 space-y-2">
                        {user.nivel_permiso === 1 && (
                            <>
                                <Link href="/logistica/dashboard" className="block py-2 px-4 hover:bg-slate-700 rounded">Dashboard</Link>
                                <Link href="/logistica/pedidos" className="block py-2 px-4 hover:bg-slate-700 rounded">Pedidos</Link>
                                <Link href="/logistica/productos" className="block py-2 px-4 hover:bg-slate-700 rounded">Productos</Link>
                                <Link href="/logistica/almacen" className="block py-2 px-4 hover:bg-slate-700 rounded">Almacenes</Link>
                                <Link href="/logistica/inventario" className="block py-2 px-4 hover:bg-slate-700 rounded">Inventario</Link>
                                <Link href="/logistica/rutas" className="block py-2 px-4 hover:bg-slate-700 rounded">Rutas</Link>
                                <Link href="/logistica/devoluciones" className="block py-2 px-4 hover:bg-slate-700 rounded">Devoluciones</Link>
                                <Link href="/logistica/motos" className="block py-2 px-4 hover:bg-slate-700 rounded">Motos</Link>
                                <Link href="/logistica/usuarios" className="block py-2 px-4 hover:bg-slate-700 rounded">Usuarios</Link>
                            </>
                        )}
                        {user.nivel_permiso !== 1 && (
                            <Link href="/logistica/chofer" className="block py-2 px-4 hover:bg-slate-700 rounded">Mis Envíos</Link>
                        )}

                        <form action={logout} className="pt-4 border-t border-slate-700 mt-4">
                            <button type="submit" className="w-full text-left py-2 px-4 text-red-400 hover:bg-slate-700 rounded">
                                Cerrar Sesión
                            </button>
                        </form>
                    </nav>
                </aside>
            )}

            <main className="flex-grow p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}

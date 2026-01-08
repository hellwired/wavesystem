'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, LogOut, Building2, Store } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/articulos-del-sur/admin/dashboard' },
    { name: 'Depósito', icon: Building2, href: '/articulos-del-sur/admin/depositos' },
    { name: 'Local Uruguay', icon: Store, href: '/articulos-del-sur/admin/products' },
    { name: 'Categorías', icon: Tag, href: '/articulos-del-sur/admin/categories' },
    { name: 'Ventas', icon: ShoppingCart, href: '/articulos-del-sur/admin/orders' },
    { name: 'Usuarios', icon: Users, href: '/articulos-del-sur/admin/users' },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch('/next/api/auth/logout', { method: 'POST' });
        window.location.href = '/next/articulos-del-sur/login';
    };

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-orange-500">Admin</span> Panel
                </h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}

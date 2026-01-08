'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth_auditoria';
import { User } from '@/app/actions/logistica';

interface AuditoriaClientLayoutProps {
    children: React.ReactNode;
    user: User | null;
}

export default function AuditoriaClientLayout({
    children,
    user
}: AuditoriaClientLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { href: '/AuditoriaDepoStock', label: 'Dashboard', icon: 'dashboard' },
        { href: '/AuditoriaDepoStock/conteo', label: 'Auditorías', icon: 'fact_check' },
        { href: '/AuditoriaDepoStock/ubicaciones', label: 'Ubicaciones', icon: 'shelves' },
        { href: '/AuditoriaDepoStock/checklists', label: 'Checklists', icon: 'checklist' },
        { href: '/AuditoriaDepoStock/informes', label: 'Reportes', icon: 'bar_chart' },
        { href: '/AuditoriaDepoStock/import', label: 'Importar', icon: 'cloud_upload' },
        { href: '/AuditoriaDepoStock/usuarios', label: 'Usuarios', icon: 'group' },
        { href: '/AuditoriaDepoStock/configuracion', label: 'Configuración', icon: 'settings' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex h-screen w-full bg-[#f6f6f8] dark:bg-[#101622] text-[#0d121b] dark:text-gray-100 font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1a2230] border-r border-[#e7ebf3] dark:border-[#2a3441] 
                transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                flex flex-col justify-between
            `}>
                <div className="flex flex-col p-4 gap-6">
                    {/* User/Brand Info */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-blue-600/10 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined">inventory_2</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#0d121b] dark:text-white text-base font-bold leading-normal">Auditoría Stock</h1>
                                <p className="text-[#4c669a] dark:text-gray-400 text-xs font-normal leading-normal">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            className="lg:hidden text-[#4c669a]"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive(item.href)
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${isActive(item.href) ? '' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className={`text-sm font-medium tracking-wide ${isActive(item.href) ? 'text-white' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        ))}

                        <div className="my-2 border-t border-[#e7ebf3] dark:border-[#2a3441]"></div>

                        <button
                            onClick={async () => {
                                setIsSidebarOpen(false);
                                await logout();
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600"
                        >
                            <span className="material-symbols-outlined text-[22px] transition-transform duration-200 group-hover:scale-110 notranslate">
                                logout
                            </span>
                            <span className="text-sm font-medium tracking-wide">
                                Cerrar Sesión
                            </span>
                        </button>
                    </nav>
                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Nav */}
                <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#1a2230] flex-shrink-0 z-10 gap-4">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            className="lg:hidden text-[#4c669a] dark:text-gray-400 p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        </button>
                        {/* Breadcrumbs/Title mobile */}
                        <h2 className="text-[#0d121b] dark:text-white text-lg font-bold lg:hidden truncate max-w-[150px] sm:max-w-none">
                            {menuItems.find(item => isActive(item.href))?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex flex-1 justify-end items-center gap-3 lg:gap-6">
                        {/* Search Bar: Visible en móvil pero compacta o expandible si se desea. Aquí la haremos full responsive */}
                        <label className="flex flex-1 max-w-md h-10">
                            <div className="flex w-full flex-1 items-stretch rounded-lg bg-[#f6f6f8] dark:bg-[#101622] border border-transparent focus-within:border-blue-600/50 transition-colors">
                                <div className="text-[#4c669a] dark:text-gray-400 flex items-center justify-center pl-3">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </div>
                                <input className="w-full bg-transparent border-none text-sm text-[#0d121b] dark:text-white focus:ring-0 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 min-w-0" placeholder="Buscar..." />
                            </div>
                        </label>

                        {/* Notifications */}
                        <button className="relative flex-shrink-0 flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-[#4c669a] dark:text-gray-400 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white dark:border-[#1a2230]"></span>
                        </button>
                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-2 border-l border-[#e7ebf3] dark:border-[#2a3441]">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-[#0d121b] dark:text-white leading-tight">{user ? user.username : 'Usuario'}</p>
                                <p className="text-xs text-[#4c669a] dark:text-gray-400">{user?.nivel_permiso === 1 ? 'Administrador' : 'Operador'}</p>
                            </div>
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white dark:ring-gray-700 bg-gray-300 flex-shrink-0"></div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#f6f6f8] dark:bg-[#101622] p-4 lg:p-8 scrollbar-hide">
                    {children}
                </div>
            </main>
        </div>
    );
}

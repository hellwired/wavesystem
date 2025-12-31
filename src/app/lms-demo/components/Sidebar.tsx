'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Book, Calendar, Folder, Home, LogOut, User } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, loading } = useAuth();

    if (loading || !user) return null;

    const navItems = [
        { icon: Home, label: 'Inicio', href: '/lms-demo/dashboard' },
        { icon: Book, label: 'Mis materias', href: '/lms-demo/dashboard' },
        { icon: Calendar, label: 'Calendario', href: '#' },
        { icon: Folder, label: 'Repositorio Personal', href: '#' },
        { icon: Folder, label: 'Repositorio de la Materia', href: '#' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:inset-auto
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 flex items-center justify-center border-b border-blue-500 bg-white">
                    <div className="relative w-32 h-12 flex items-center justify-center">
                        <img
                            src="/next/images/lms-logo-v2.png"
                            alt="LMS Demo"
                            className="object-contain max-h-full max-w-full"
                        />
                    </div>
                </div>

                <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-700 transition-colors"
                            onClick={() => onClose()} // Close on navigation (mobile)
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-blue-200 truncate">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { localStorage.removeItem('lms_token'); window.location.href = '/next/lms-demo/login'; }}
                        className="flex items-center gap-2 text-sm text-blue-100 hover:text-white w-full"
                    >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
}

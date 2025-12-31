import React from 'react';
import { getUsuarios } from '@/app/actions/usuarios';
import UserList from './UserList';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function UsuariosPage() {
    const users = await getUsuarios();

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/AuditoriaDepoStock/configuracion" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline mb-2">
                    <ArrowLeft size={16} />
                    Volver a Configuración
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#0d121b] dark:text-white text-3xl font-black tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-[#4c669a] dark:text-gray-400 text-base">
                        Administra el acceso y los roles de los auditores y administradores del sistema.
                    </p>
                </div>
            </div>

            <UserList initialUsers={users} />
        </div>
    );
}

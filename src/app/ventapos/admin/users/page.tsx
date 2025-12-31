import { getUsers } from '../../actions/users';
import { CreateUserForm } from './CreateUserForm';
import { Check, Shield, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default async function UsersAdminPage() {
    const res = await getUsers();
    const users = res.success && res.data ? res.data : [];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/ventapos/dashboard" className="text-neutral-500 hover:text-emerald-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </Link>
                            <span className="text-sm font-medium text-orange-500 uppercase tracking-wider">Seguridad</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                    </div>
                </div>

                {/* Create User Form */}
                <CreateUserForm />

                {/* Users List */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Usuario</th>
                                <th className="px-6 py-4 font-medium">Rol</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium">Fecha Creación</th>
                                {/* <th className="px-6 py-4 font-medium text-right">Acciones</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-400">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border
                                            ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                user.role === 'MANAGER' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                    user.role === 'AUXILIARY' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isActive ? (
                                            <span className="text-emerald-500 flex items-center gap-1 font-medium"><Check className="w-3 h-3" /> Activo</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Inactivo</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

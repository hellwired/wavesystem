'use client';

import { useRef } from 'react';
import { createUser } from '../../actions/users';
import { Plus } from 'lucide-react';

export function CreateUserForm() {
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        const res = await createUser(formData);
        if (res?.error) {
            alert(res.error);
        } else {
            formRef.current?.reset();
            // Optional: You could trigger a toast here
        }
    }

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" /> Nuevo Usuario
            </h2>
            <form
                ref={formRef}
                action={handleSubmit}
                className="flex flex-col md:flex-row gap-4 items-end"
            >
                <div className="flex-1 w-full">
                    <label className="block text-xs text-neutral-500 mb-1">Usuario</label>
                    <input name="username" type="text" placeholder="ej: jperez" className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" required />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-xs text-neutral-500 mb-1">Contraseña</label>
                    <input name="password" type="password" placeholder="******" className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" required />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-xs text-neutral-500 mb-1">Rol</label>
                    <select name="role" className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" required>
                        <option value="CASHIER">Cajero (Venta Only)</option>
                        <option value="AUXILIARY">Auxiliar (Venta + Productos)</option>
                        <option value="MANAGER">Gerente (Venta + Prod + Reportes)</option>
                        <option value="ADMIN">Admin (Acceso Total)</option>
                    </select>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors w-full md:w-auto">
                    Crear Usuario
                </button>
            </form>
        </div>
    );
}

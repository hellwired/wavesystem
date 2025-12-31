'use client';

import { useFormStatus } from 'react-dom';
import { authenticateUser } from '@/app/actions/asistencia_admin';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
            {pending ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
    );
}

export default function AdminLoginPage() {
    const [error, setError] = useState('');
    const router = useRouter();

    async function clientAction(formData: FormData) {
        const res = await authenticateUser(formData);
        if (res.success) {
            router.push('/Asistencia/admin/dashboard');
        } else {
            setError(res.message || 'Error desconocido');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Asistencia</h2>
                <form action={clientAction}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Usuario</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="admin"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="*******"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { createInitialUser } from '@/app/actions/auth_auditoria';

export default function SetupPage() {
    const [status, setStatus] = useState<string>('Esperando acción...');
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus('Creando usuario...');
        try {
            await createInitialUser();
            setStatus('Usuario admin creado/verificado correctamente. Intenta loguearte.');
        } catch (error) {
            setStatus('Error: ' + String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
            <h1 className="text-2xl font-bold mb-4">Setup Auditoría</h1>
            <p className="mb-6">Esta página creará el usuario <strong>admin</strong> con contraseña <strong>admin123</strong> si no existe.</p>

            <button
                onClick={handleSeed}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Procesando...' : 'Crear Usuario Admin'}
            </button>

            <div className="mt-6 p-4 bg-white rounded shadow w-full max-w-md text-center">
                <p className="font-mono text-sm">{status}</p>
            </div>
        </div>
    );
}

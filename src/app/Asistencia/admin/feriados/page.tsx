import { getFeriados } from '@/app/actions/feriados_admin';
import Link from 'next/link';
import FeriadoListClient from './client-page';

export default async function FeriadosPage() {
    const feriados = await getFeriados();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/Asistencia/admin/dashboard" className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                            ← Volver
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Calendario de Feriados</h1>
                    </div>
                </div>

                <FeriadoListClient feriados={feriados} />
            </div>
        </div>
    );
}

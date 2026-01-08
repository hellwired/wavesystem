'use client';
import { useEffect, useState } from 'react';
import { Building2, Package } from 'lucide-react';

export default function DepositosDashboardPage() {
    // Nota: Esto es dummy data por ahora hasta que hagamos el endpoint de depositos
    // O podemos hacerlo real si queremos, pero por ahora solo se pidio listado.
    const depositos = [
        { id: 1, nombre: 'Depósito Central', ubicacion: 'Almacén Principal' },
        { id: 2, nombre: 'Local Venta', ubicacion: 'Showroom' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Depósitos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {depositos.map(depo => (
                    <div key={depo.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className="p-4 bg-slate-100 text-slate-600 rounded-xl">
                            <Building2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{depo.nombre}</h3>
                            <p className="text-gray-500">{depo.ubicacion}</p>
                            <div className="mt-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${depo.id === 1 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                    ID: {depo.id}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                    Activo
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

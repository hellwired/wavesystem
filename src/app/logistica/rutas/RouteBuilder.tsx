'use client';

import { useState } from 'react';
import { createRoute } from '@/app/actions/tms';

export default function RouteBuilder({ pendingOrders, availableMotos }: { pendingOrders: any[], availableMotos: any[] }) {
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

    const toggleOrder = (id: number) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(o => o !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    return (
        <form action={createRoute}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Vehículo</label>
                    <select name="moto_id" required className="w-full border p-2 rounded mt-1">
                        <option value="">Seleccionar Vehículo...</option>
                        {availableMotos.map((m: any) => (
                            <option key={m.id} value={m.id}>{m.nombre} ({m.patente})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pedidos a Incluir ({selectedOrders.length})
                    </label>
                    <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-50 space-y-2">
                        {pendingOrders.map((order: any) => (
                            <div
                                key={order.id}
                                onClick={() => toggleOrder(order.id)}
                                className={`
                                    flex items-start gap-2 p-3 rounded cursor-pointer border-b last:border-0 transition-colors
                                    ${selectedOrders.includes(order.id) ? 'bg-purple-100 border-purple-200' : 'hover:bg-gray-100 border-gray-200'}
                                `}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.includes(order.id)}
                                    onChange={() => { }}
                                    className="mt-1 pointer-events-none"
                                />
                                <div className="text-sm">
                                    <div className="font-bold text-gray-800">#{order.id} | {order.cliente}</div>
                                    <div className="text-gray-500 text-xs">{order.direccion}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <input type="hidden" name="order_ids" value={selectedOrders.join(',')} />

                <button
                    type="submit"
                    disabled={selectedOrders.length === 0}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generar Ruta
                </button>
            </div>
        </form>
    );
}

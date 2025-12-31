'use client';
import { useEffect, useState } from 'react';
import { Eye, Loader2, Calendar, User, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: number;
    user_name: string;
    total_amount: string;
    status: string;
    created_at: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/next/api/orders')
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700'; // pending
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Ventas</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold text-sm">
                        <tr>
                            <th className="p-4"># Orden</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono font-bold text-slate-700">#{order.id}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-400" />
                                        <span className="font-medium text-slate-900">{order.user_name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold text-slate-900">
                                    ${Number(order.total_amount).toLocaleString()}
                                </td>
                                <td className="p-4 text-center">
                                    <Link
                                        href={`/articulos-del-sur/admin/orders/${order.id}`}
                                        className="inline-flex p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                    >
                                        <Eye size={20} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No hay ventas registradas aún.
                    </div>
                )}
            </div>
        </div>
    );
}

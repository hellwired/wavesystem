'use client';
import { useEffect, useState } from 'react';
import { Eye, Loader2, Calendar, User, DollarSign, Plus, CreditCard, Banknote, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: number;
    user_name: string;
    total_amount: string;
    status: string;
    created_at: string;
    payment_method: string;
    installments: number;
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

    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'credit_card': return <CreditCard size={16} className="text-blue-500" />;
            case 'mercado_pago': return <Smartphone size={16} className="text-sky-500" />;
            default: return <Banknote size={16} className="text-green-500" />;
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Ventas</h1>
                <Link
                    href="/articulos-del-sur/admin/orders/create"
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
                >
                    <Plus size={20} /> Nueva Venta (POS)
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold text-sm">
                        <tr>
                            <th className="p-4"># Orden</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Pago</th>
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
                                <td className="p-4">
                                    <div className="flex items-center gap-2" title={order.payment_method}>
                                        {getPaymentIcon(order.payment_method)}
                                        <span className="text-sm font-medium capitalize text-slate-600">
                                            {order.payment_method?.replace('_', ' ') || 'cash'}
                                            {order.payment_method === 'credit_card' && order.installments > 1 && (
                                                <span className="ml-1 text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{order.installments}x</span>
                                            )}
                                        </span>
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

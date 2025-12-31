'use client';
import { useEffect, useState, use } from 'react';
import { Loader2, ArrowLeft, Package, MapPin, Phone, Mail, CheckCircle, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch(`/next/api/orders/${params.id}`)
            .then(res => res.json())
            .then(data => setOrder(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [params.id]);

    const updateStatus = async (newStatus: string) => {
        if (!confirm(`¿Cambiar estado a "${newStatus}"?`)) return;
        setUpdating(true);
        try {
            await fetch(`/next/api/orders/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            setOrder({ ...order, status: newStatus });
            router.refresh();
        } catch (error) {
            alert('Error al actualizar');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;
    if (!order) return <div>Orden no encontrada</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link href="/articulos-del-sur/admin/orders" className="flex items-center text-gray-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Volver a Ventas
                </Link>
                <div className="text-sm font-mono text-gray-400">
                    ID: #{order.id}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Package className="text-orange-500" /> Productos
                        </h2>
                        <div className="space-y-4">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                        {item.image_url ? (
                                            <img src={`/${item.image_url}`} alt={item.product_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><Package size={20} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{item.product_name}</h3>
                                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-medium text-slate-900">
                                        ${Number(item.price).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Total Pagado</span>
                            <span className="text-2xl font-bold text-slate-900">${Number(order.total_amount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer & Actions */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-gray-500 font-bold mb-4 uppercase text-xs tracking-wider">Estado del Pedido</h3>
                        <div className="mb-6">
                            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase w-full text-center ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => updateStatus('shipped')} disabled={updating}
                                className="w-full py-2 px-4 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors text-sm"
                            >
                                Marcar como Enviado
                            </button>
                            <button
                                onClick={() => updateStatus('paid')} disabled={updating}
                                className="w-full py-2 px-4 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 font-medium transition-colors text-sm"
                            >
                                Marcar como Pagado
                            </button>
                            <button
                                onClick={() => updateStatus('cancelled')} disabled={updating}
                                className="w-full py-2 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors text-sm"
                            >
                                Cancelar Orden
                            </button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-gray-500 font-bold mb-4 uppercase text-xs tracking-wider">Detalles del Cliente</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="font-bold text-slate-900">{order.user_name}</p>
                                    <p className="text-xs text-gray-500">ID: {order.user_id}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="text-gray-400 mt-1" size={18} />
                                <p className="text-sm text-slate-700 break-all">{order.user_email}</p>
                            </div>
                            {order.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="text-gray-400" size={18} />
                                    <p className="text-sm text-slate-700">{order.phone}</p>
                                </div>
                            )}
                            <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                                <MapPin className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="font-bold text-xs text-gray-500 uppercase mb-1">Dirección de Envío</p>
                                    <p className="text-sm text-slate-700">{order.address || 'No especificada'}</p>
                                    <p className="text-sm text-gray-500">{order.city} {order.province}</p>
                                    {order.zip_code && <p className="text-sm text-gray-500">CP: {order.zip_code}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

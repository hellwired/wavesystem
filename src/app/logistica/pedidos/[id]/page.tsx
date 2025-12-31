import { getOrderDetails, getOrders } from '@/app/actions/logistica';
import Link from 'next/link';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const orderId = parseInt(id);
    const items = await getOrderDetails(orderId);

    // We need to fetch the order header too, but getOrders returns all. 
    // Ideally we should have getOrder(id). For now, let's filter from getOrders (inefficient but works for demo)
    const orders = await getOrders();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return <div>Pedido no encontrado</div>;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/logistica/pedidos" className="text-blue-600 hover:underline">← Volver</Link>
                <h1 className="text-3xl font-bold text-gray-800">Pedido #{order.id}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        order.estado === 'preparado' ? 'bg-blue-100 text-blue-800' :
                            order.estado === 'en_camino' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                    }`}>
                    {order.estado.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Información del Cliente</h2>
                    <div className="space-y-2">
                        <p><span className="font-semibold text-gray-600">Cliente:</span> {order.cliente}</p>
                        <p><span className="font-semibold text-gray-600">Dirección:</span> {order.direccion}</p>
                        <p><span className="font-semibold text-gray-600">Fecha:</span> {new Date(order.fecha).toLocaleString()}</p>
                        {order.moto_id && <p><span className="font-semibold text-gray-600">Moto Asignada:</span> #{order.moto_id}</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Estrategia Logística</h2>
                    <div className="space-y-2">
                        <p><span className="font-semibold text-gray-600">Picking:</span> <span className="bg-gray-100 px-2 py-0.5 rounded text-sm">FIFO (First-In, First-Out)</span></p>
                        <p className="text-sm text-gray-500 mt-2">
                            El sistema ha asignado automáticamente los lotes más antiguos para garantizar la rotación del inventario.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Lista de Picking (Preparación)</h2>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <th className="px-6 py-3 border-b">Producto</th>
                            <th className="px-6 py-3 border-b">SKU</th>
                            <th className="px-6 py-3 border-b">Cantidad</th>
                            <th className="px-6 py-3 border-b">Ubicación / Lote</th>
                            <th className="px-6 py-3 border-b">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b font-medium">{item.nombre_producto}</td>
                                <td className="px-6 py-4 border-b text-gray-500">SKU-{item.producto_id}</td>
                                <td className="px-6 py-4 border-b font-bold">{item.cantidad}</td>
                                <td className="px-6 py-4 border-b">
                                    {/* In a real app we would join with lotes table to show batch code */}
                                    {item.lote_id ? (
                                        <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded text-xs font-mono">
                                            LOTE #{item.lote_id}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">General Stock</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <span className="text-green-600 flex items-center gap-1 text-sm">
                                        <span className="material-symbols-outlined text-base">check_circle</span>
                                        Asignado
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

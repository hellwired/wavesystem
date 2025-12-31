import { getOrders, getMotos, createOrder, assignMoto, getProducts } from '@/app/actions/logistica';

export default async function PedidosPage() {
    const orders = await getOrders();
    const motos = await getMotos();
    const products = await getProducts();
    const availableMotos = motos.filter(m => m.estado === 'disponible');

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestión de Pedidos</h1>

            {/* Create Order Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Nuevo Pedido</h2>
                <form action={createOrder} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                        <input type="text" name="cliente" placeholder="Nombre Cliente" required className="w-full border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input type="text" name="direccion" placeholder="Dirección Entrega" required className="w-full border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                        <select name="producto_id" required className="w-full border border-gray-300 p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Seleccionar Producto</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <div className="flex gap-2">
                            <input type="number" name="cantidad" placeholder="Cant." min="1" required className="w-full border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow-sm whitespace-nowrap">Crear</button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <th className="px-6 py-3 border-b">ID</th>
                            <th className="px-6 py-3 border-b">Fecha</th>
                            <th className="px-6 py-3 border-b">Cliente</th>
                            <th className="px-6 py-3 border-b">Dirección</th>
                            <th className="px-6 py-3 border-b">Estrategia</th>
                            <th className="px-6 py-3 border-b">Estado</th>
                            <th className="px-6 py-3 border-b">Asignar Moto</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b">#{order.id}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-500">
                                    {order.fecha ? new Date(order.fecha).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 border-b font-medium">{order.cliente}</td>
                                <td className="px-6 py-4 border-b">{order.direccion}</td>
                                <td className="px-6 py-4 border-b">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">FIFO</span>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                        order.estado === 'preparado' ? 'bg-blue-100 text-blue-800' :
                                            order.estado === 'en_camino' ? 'bg-purple-100 text-purple-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {order.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    {order.estado === 'pendiente' && (
                                        <form action={async (formData) => {
                                            'use server';
                                            const motoId = parseInt(formData.get('moto_id') as string);
                                            await assignMoto(order.id, motoId);
                                        }}>
                                            <div className="flex gap-2">
                                                <select name="moto_id" className="border p-1 rounded text-sm w-32" required>
                                                    <option value="">Moto...</option>
                                                    {availableMotos.map(moto => (
                                                        <option key={moto.id} value={moto.id}>{moto.nombre}</option>
                                                    ))}
                                                </select>
                                                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Asignar</button>
                                            </div>
                                        </form>
                                    )}
                                    {order.moto_id && (
                                        <span className="text-sm text-gray-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">two_wheeler</span>
                                            {motos.find(m => m.id === order.moto_id)?.nombre || order.moto_id}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

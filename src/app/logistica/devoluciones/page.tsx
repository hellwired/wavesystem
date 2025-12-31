
import { getReturnRequests, createReturnRequest, processReturn, getDeliveredOrders } from '@/app/actions/returns';

export default async function DevolucionesPage() {
    const returns = await getReturnRequests();
    const deliveredOrders = await getDeliveredOrders();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestión de Devoluciones (RMA)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario Nueva Devolución */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-6 border-l-4 border-red-500">
                        <h2 className="text-xl font-semibold mb-4 text-red-700">Iniciar Devolución</h2>
                        <form action={createReturnRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pedido Original</label>
                                <select name="pedido_id" required className="w-full border p-2 rounded mt-1">
                                    <option value="">Seleccionar Pedido Entregado...</option>
                                    {deliveredOrders.map((o: any) => (
                                        <option key={o.id} value={o.id}>#{o.id} - {o.cliente} ({new Date(o.fecha).toLocaleDateString()})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Motivo</label>
                                <select name="motivo" required className="w-full border p-2 rounded mt-1">
                                    <option value="Dañado">Producto Dañado</option>
                                    <option value="Incorrecto">Producto Incorrecto</option>
                                    <option value="Arrepentimiento">Cliente se arrepintió</option>
                                    <option value="Garantia">Falla / Garantía</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Resolución Esperada</label>
                                <select name="resolucion" required className="w-full border p-2 rounded mt-1">
                                    <option value="reembolso">Reembolso</option>
                                    <option value="cambio">Cambio por otro producto</option>
                                    <option value="reparacion">Reparación</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-bold">
                                Crear Solicitud RMA
                            </button>
                        </form>
                    </div>
                </div>

                {/* Listado de Devoluciones */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                                        <th className="px-6 py-3 border-b">ID / Fecha</th>
                                        <th className="px-6 py-3 border-b">Cliente / Pedido</th>
                                        <th className="px-6 py-3 border-b">Motivo / Resolución</th>
                                        <th className="px-6 py-3 border-b">Estado</th>
                                        <th className="px-6 py-3 border-b">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {returns.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                                No hay devoluciones registradas.
                                            </td>
                                        </tr>
                                    ) : (
                                        returns.map((rma) => (
                                            <tr key={rma.id} className="hover:bg-gray-50 border-b last:border-0">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800">RMA-{rma.id}</div>
                                                    <div className="text-xs text-gray-500">{new Date(rma.fecha_solicitud).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{rma.cliente}</div>
                                                    <div className="text-xs text-gray-500">Ref: Pedido #{rma.pedido_id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="block text-sm text-red-600 font-medium">{rma.motivo}</span>
                                                    <span className="block text-xs text-gray-500 capitalize">{rma.resolucion}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase 
                                                        ${rma.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                            rma.estado === 'aprobada' ? 'bg-blue-100 text-blue-800' :
                                                                rma.estado === 'recibida' ? 'bg-purple-100 text-purple-800' :
                                                                    rma.estado === 'rechazada' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                                        {rma.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rma.estado === 'pendiente' && (
                                                        <div className="flex gap-2">
                                                            <form action={processReturn.bind(null, rma.id, 'approve')}>
                                                                <button title="Aprobar" className="bg-green-100 text-green-700 p-1 rounded hover:bg-green-200">
                                                                    ✅
                                                                </button>
                                                            </form>
                                                            <form action={processReturn.bind(null, rma.id, 'reject')}>
                                                                <button title="Rechazar" className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200">
                                                                    ❌
                                                                </button>
                                                            </form>
                                                        </div>
                                                    )}
                                                    {rma.estado === 'aprobada' && (
                                                        <form action={processReturn.bind(null, rma.id, 'receive')}>
                                                            <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700">
                                                                Recibir Stock
                                                            </button>
                                                        </form>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

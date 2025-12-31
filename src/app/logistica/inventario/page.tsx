
import { getProducts } from '@/app/actions/logistica';
import { getWarehouses, getLocations } from '@/app/actions/wms';
import { getInventory, receiveStock } from '@/app/actions/inventory';

export default async function InventarioPage() {
    const products = await getProducts();
    const inventory = await getInventory();

    // For the form, we ideally need to pick a warehouse first to filter locations. 
    // Simplified for demo: fetching all locations from first active warehouse or just a big list (warning: bad for perf in prod)
    // Let's just fetch warehouses and maybe load locations via client-side or just fetch all for now if small scale.
    // Better Approach: Server Component fetches lists.

    // Fetching all locations for the selector might be heavy, but let's do it for the demo MVP.
    // Requires a new action to get ALL locations or just use the first warehouse for now.
    const warehouses = await getWarehouses();
    let allLocations: any[] = [];
    if (warehouses.length > 0) {
        // This is a bit hacky for a server component without interactive state, 
        // usually you'd select warehouse then location. 
        // Let's just get locations for the first warehouse as default.
        allLocations = await getLocations(warehouses[0].id);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Operaciones de Inventario</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel de Recepción */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-6 border-l-4 border-green-500">
                        <h2 className="text-xl font-semibold mb-4 text-green-700">Recepción de Mercadería</h2>
                        <form action={receiveStock} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Producto</label>
                                <select name="producto_id" required className="w-full border p-2 rounded mt-1">
                                    <option value="">Seleccionar Producto...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.sku} - {p.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ubicación Destino (Almacén 1)</label>
                                <select name="ubicacion_id" required className="w-full border p-2 rounded mt-1">
                                    <option value="">Seleccionar Ubicación...</option>
                                    {allLocations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.codigo} ({loc.tipo})</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-400 mt-1">* Mostrando ubicaciones del primer almacén</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                                    <input type="number" name="cantidad" required min="1" className="w-full border p-2 rounded mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lote</label>
                                    <input type="text" name="lote" className="w-full border p-2 rounded mt-1" placeholder="L-2024" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vencimiento</label>
                                <input type="date" name="fecha_vencimiento" className="w-full border p-2 rounded mt-1" />
                            </div>

                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">
                                Registrar Entrada
                            </button>
                        </form>
                    </div>
                </div>

                {/* Listado de Inventario Detallado */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Stock Actual por Ubicación</h2>
                            <span className="text-sm text-gray-500">Total items: {inventory.length}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                                        <th className="px-6 py-3 border-b">Ubicación</th>
                                        <th className="px-6 py-3 border-b">SKU / Producto</th>
                                        <th className="px-6 py-3 border-b text-right">Cantidad</th>
                                        <th className="px-6 py-3 border-b">Lote</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {inventory.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                                No hay stock registrado en ubicaciones.
                                            </td>
                                        </tr>
                                    ) : (
                                        inventory.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 border-b">
                                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm font-bold text-gray-700">
                                                        {item.codigo_ubicacion}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b">
                                                    <div className="font-bold text-sm text-gray-900">{item.sku}</div>
                                                    <div className="text-sm text-gray-500">{item.nombre_producto}</div>
                                                </td>
                                                <td className="px-6 py-4 border-b text-right font-bold text-blue-600">
                                                    {item.cantidad}
                                                </td>
                                                <td className="px-6 py-4 border-b text-sm">
                                                    {item.lote && (
                                                        <span className="block text-gray-600">Lote: {item.lote}</span>
                                                    )}
                                                    {item.fecha_vencimiento && (
                                                        <span className="block text-xs text-red-500">
                                                            Vence: {new Date(item.fecha_vencimiento).toLocaleDateString()}
                                                        </span>
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

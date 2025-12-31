
import { getWarehouseById, getLocations, createLocation } from '@/app/actions/wms';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AlmacenDetallePage({ params }: { params: { id: string } }) {
    // Await params correctly in Next.js 15+ if needed, but for 14 it's sync usually. 
    // However, in recent Next versions params is a promise.
    const resolvedParams = await Promise.resolve(params); // Safety wrapper
    const warehouseId = parseInt(resolvedParams.id);

    const warehouse = await getWarehouseById(warehouseId);
    if (!warehouse) notFound();

    const locations = await getLocations(warehouseId);

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/logistica/almacen" className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">{warehouse.nombre}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Formulario Ubicación */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Nueva Ubicación</h2>
                        <form action={createLocation} className="space-y-4">
                            <input type="hidden" name="almacen_id" value={warehouseId} />

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Pasillo</label>
                                    <input type="text" name="pasillo" required className="w-full border p-2 rounded mt-1" placeholder="A" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Estantería</label>
                                    <input type="text" name="estanteria" required className="w-full border p-2 rounded mt-1" placeholder="01" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Altura</label>
                                    <input type="text" name="altura" required className="w-full border p-2 rounded mt-1" placeholder="1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Tipo</label>
                                    <select name="tipo" className="w-full border p-2 rounded mt-1">
                                        <option value="almacenamiento">Almacén</option>
                                        <option value="picking">Picking</option>
                                        <option value="recepcion">Recepción</option>
                                        <option value="despacho">Despacho</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Código (Opcional)</label>
                                <input type="text" name="codigo" className="w-full border p-2 rounded mt-1" placeholder="Auto-generado" />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                Agregar Ubicación
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-gray-50 rounded border text-sm text-gray-600">
                            <p className="font-semibold mb-1">Estructura Sugerida:</p>
                            <p>Pasillo (A-Z) - Estantería (01-99) - Altura (1-5)</p>
                        </div>
                    </div>
                </div>

                {/* Mapa de Ubicaciones */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Mapa de Ubicaciones</h2>

                        {locations.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                No hay ubicaciones definidas.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 Gap-4">
                                {locations.map(loc => (
                                    <div key={loc.id} className={`
                                        p-3 rounded border text-center text-sm
                                        ${loc.tipo === 'picking' ? 'bg-yellow-50 border-yellow-200' :
                                            loc.tipo === 'recepcion' ? 'bg-blue-50 border-blue-200' :
                                                'bg-gray-50 border-gray-200'}
                                    `}>
                                        <div className="font-bold text-gray-800">{loc.codigo}</div>
                                        <div className="text-xs text-gray-500 uppercase mt-1">{loc.tipo}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

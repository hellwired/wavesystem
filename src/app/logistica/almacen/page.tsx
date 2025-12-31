
import Link from 'next/link';
import { getWarehouses, createWarehouse } from '@/app/actions/wms';

export default async function AlmacenPage() {
    const warehouses = await getWarehouses();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestión de Almacenes</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Creación */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Nuevo Almacén</h2>
                        <form action={createWarehouse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" name="nombre" required className="w-full border p-2 rounded mt-1" placeholder="Ej. Almacén Central" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                <input type="text" name="direccion" required className="w-full border p-2 rounded mt-1" placeholder="Calle 123" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacidad (m³)</label>
                                <input type="number" name="capacidad" className="w-full border p-2 rounded mt-1" placeholder="1000" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                Crear Almacén
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lista de Almacenes */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {warehouses.map((wh) => (
                            <Link key={wh.id} href={`/logistica/almacen/${wh.id}`} className="block group">
                                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 group-hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">{wh.nombre}</h3>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Activo</span>
                                    </div>
                                    <p className="text-gray-600 mt-2 text-sm">{wh.direccion}</p>
                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                        Capacidad: {wh.capacidad_total} m³
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {warehouses.length === 0 && (
                            <div className="col-span-2 bg-gray-50 p-8 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
                                No hay almacenes registrados. Comienza creando uno.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

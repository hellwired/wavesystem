
import { getDashboardStats } from '@/app/actions/dashboard';
import { getSession } from '@/app/actions/logistica';
import Link from 'next/link';

export default async function DashboardPage() {
    const session = await getSession();
    const stats = await getDashboardStats();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Panel de Control Logístico</h1>
                <p className="text-gray-500">Bienvenido, {session?.username} | {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Inventory Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Inventario</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.inventory.totalProducts} <span className="text-sm font-normal text-gray-400">SKUs</span></h3>
                        </div>
                        <span className="text-2xl">📦</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Valor Total:</span>
                            <span className="font-bold text-green-600">${stats.inventory.totalValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Bajo Stock:</span>
                            <span className={`font-bold ${stats.inventory.lowStock > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                {stats.inventory.lowStock} items
                            </span>
                        </div>
                    </div>
                    <Link href="/logistica/inventario" className="block mt-4 text-center text-blue-600 text-sm hover:underline">Gestionar Inventario →</Link>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Pedidos</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.orders.pending} <span className="text-sm font-normal text-gray-400">Pendientes</span></h3>
                        </div>
                        <span className="text-2xl">🛒</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Nuevos hoy:</span>
                            <span className="font-bold text-gray-800">{stats.orders.today}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Entregados hoy:</span>
                            <span className="font-bold text-green-600">{stats.orders.deliveredToday}</span>
                        </div>
                    </div>
                    <Link href="/logistica/pedidos" className="block mt-4 text-center text-blue-600 text-sm hover:underline">Ver Pedidos →</Link>
                </div>

                {/* Transport Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Transporte</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.transport.activeRoutes} <span className="text-sm font-normal text-gray-400">Rutas Activas</span></h3>
                        </div>
                        <span className="text-2xl">🚚</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Motos Disponibles:</span>
                            <span className="font-bold text-gray-800">{stats.transport.availableMotos}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Estado Flota:</span>
                            <span className="font-bold text-green-600">OK</span>
                        </div>
                    </div>
                    <Link href="/logistica/rutas" className="block mt-4 text-center text-blue-600 text-sm hover:underline">Planificador →</Link>
                </div>

                {/* Returns Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Devoluciones</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.returns.pending} <span className="text-sm font-normal text-gray-400">Pendientes</span></h3>
                        </div>
                        <span className="text-2xl">↩️</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Acción Requerida:</span>
                            <span className={`font-bold ${stats.returns.pending > 0 ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}>
                                {stats.returns.pending > 0 ? 'Revisar Ahora' : 'Nada pendiente'}
                            </span>
                        </div>
                    </div>
                    <Link href="/logistica/devoluciones" className="block mt-4 text-center text-blue-600 text-sm hover:underline">Gestionar RMA →</Link>
                </div>
            </div>

            {/* Quick Actions or Charts could go here */}
            <div className="bg-slate-50 p-8 rounded border border-dashed border-gray-300 text-center">
                <p className="text-gray-500">Gráficos de rendimiento (Ventas vs Tiempo, Mapa de calor de entregas) irían aquí en una versión futura.</p>
            </div>
        </div>
    );
}

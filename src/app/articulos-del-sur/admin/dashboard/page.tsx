import { Suspense } from 'react';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Ventas del Mes</h3>
                    <p className="text-3xl font-bold text-slate-900">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Pedidos Pendientes</h3>
                    <p className="text-3xl font-bold text-orange-500">0</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Productos en Stock</h3>
                    <p className="text-3xl font-bold text-slate-900">0</p>
                </div>
            </div>
        </div>
    );
}

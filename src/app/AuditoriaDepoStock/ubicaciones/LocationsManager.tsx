"use client";

import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const stats = [
    { title: "Total Ubicaciones", value: "1,240", icon: "location_on", color: "bg-blue-500" },
    { title: "Ocupación Promedio", value: "78%", icon: "pie_chart", color: "bg-green-500" },
    { title: "Ubicaciones Críticas", value: "12", icon: "warning", color: "bg-red-500" },
    { title: "Slotting Optimizado", value: "85%", icon: "check_circle", color: "bg-purple-500" },
];

const occupancyData = [
    { name: "Zona A", value: 85 },
    { name: "Zona B", value: 65 },
    { name: "Zona C", value: 92 },
    { name: "Zona D", value: 45 },
];

export default function LocationsManager({ initialLocations }: { initialLocations: any[] }) {
    const [selectedZone, setSelectedZone] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLocations = initialLocations.filter((loc) => {
        const matchesZone = selectedZone === "All" || loc.zone === selectedZone;
        const matchesSearch = loc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loc.product && loc.product.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesZone && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "occupied": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            case "empty": return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
            case "issue": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
            case "optimized": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Ubicaciones</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visualice y optimice la distribución de su inventario.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-3 py-2 bg-white dark:bg-[#1a2230] border border-gray-300 dark:border-[#2a3441] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span> Filtros
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/30 transition-all">
                        <span className="material-symbols-outlined text-[20px]">package_2</span> Optimizar
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-lg text-white ${stat.color} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Locations List/Grid */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Filters & Search */}
                    <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            {["All", "A", "B", "C", "D"].map((zone) => (
                                <button
                                    key={zone}
                                    onClick={() => setSelectedZone(zone)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedZone === zone
                                        ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                                        }`}
                                >
                                    Zona {zone === "All" ? "Todas" : zone}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                            <input
                                type="text"
                                placeholder="Buscar ubicación o producto..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#101622] text-gray-800 dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Locations Grid Visualization (Mock) */}
                    <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Mapa de Calor - Ocupación</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {filteredLocations.map((loc) => (
                                <div
                                    key={loc.id}
                                    className={`aspect-square rounded-md flex items-center justify-center text-xs font-bold cursor-pointer transition-transform hover:scale-105 ${loc.occupancy > 100 ? "bg-red-500 text-white" :
                                        loc.occupancy > 80 ? "bg-blue-500 text-white" :
                                            loc.occupancy > 50 ? "bg-blue-300 text-blue-900" :
                                                loc.occupancy > 0 ? "bg-blue-100 text-blue-800" :
                                                    "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                        }`}
                                    title={`${loc.id} - ${loc.product || "Vacío"} (${loc.occupancy}%)`}
                                >
                                    {loc.id.split("-")[2]}
                                </div>
                            ))}
                            {/* Filling with some dummy boxes for visual effect if list is short */}
                            {Array.from({ length: Math.max(0, 24 - filteredLocations.length) }).map((_, i) => (
                                <div key={`dummy-${i}`} className="aspect-square rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"></div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-4 text-sm text-gray-500 dark:text-gray-400 justify-center">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div> Vacío</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-100 rounded"></div> Bajo</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-300 rounded"></div> Medio</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div> Alto</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> Crítico</div>
                        </div>
                    </div>

                    {/* Detailed List */}
                    <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-[#2a3441]">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Detalle de Ubicaciones</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#101622]/50 text-gray-600 dark:text-gray-400 text-sm">
                                        <th className="p-4 font-medium">ID Ubicación</th>
                                        <th className="p-4 font-medium">Zona</th>
                                        <th className="p-4 font-medium">Producto</th>
                                        <th className="p-4 font-medium">Estado</th>
                                        <th className="p-4 font-medium">Ocupación</th>
                                        <th className="p-4 font-medium">Última Auditoría</th>
                                        <th className="p-4 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 dark:text-gray-300">
                                    {filteredLocations.map((loc) => (
                                        <tr key={loc.id} className="border-b border-gray-50 dark:border-[#2a3441] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{loc.id}</td>
                                            <td className="p-4">{loc.zone}</td>
                                            <td className="p-4">{loc.product || <span className="text-gray-400 italic">Sin producto</span>}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(loc.status)}`}>
                                                    {loc.status === "occupied" ? "Ocupado" :
                                                        loc.status === "empty" ? "Vacío" :
                                                            loc.status === "issue" ? "Revisar" : "Optimizado"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${loc.occupancy > 100 ? "bg-red-500" : "bg-blue-500"}`}
                                                            style={{ width: `${Math.min(loc.occupancy, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs">{loc.occupancy}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4">{loc.lastAudit}</td>
                                            <td className="p-4">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1">
                                                    Ver <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Analysis */}
                <div className="space-y-6">
                    {/* Occupancy Chart */}
                    <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ocupación por Zona</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={occupancyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ fill: '#f9fafb' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {occupancyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.value > 90 ? '#ef4444' : '#3b82f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Optimización de Slotting</h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            Hay 5 productos de alta rotación en zonas de difícil acceso.
                        </p>
                        <button className="w-full py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                            Ver Recomendaciones
                        </button>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Alertas Recientes</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg shrink-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">warning</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sobrecarga en B-01-01</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">La ubicación excede su capacidad máxima en un 10%.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg shrink-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">package_2</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Stock bajo en A-01-02</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Nivel de stock por debajo del punto de reorden.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

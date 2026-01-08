import React from 'react';
import Link from 'next/link';
import { getAuditorias, getDashboardKPIs, closeAudit } from '@/app/actions/auditoria';
import { getSession } from '@/app/actions/logistica';
import AuditActions from './auditorias/AuditActions';

export default async function AuditoriaDashboard() {
    const kpis = await getDashboardKPIs();
    const auditorias = await getAuditorias();
    const session = await getSession();
    // FIXME: Forcing admin true for testing as requested
    const isAdmin = true; // session?.nivel_permiso === 1;

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-6 lg:gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl lg:text-3xl font-black text-[#0d121b] dark:text-white tracking-tight">Dashboard Principal</h2>
                    <p className="text-[#4c669a] dark:text-gray-400 text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] notranslate">calendar_today</span>
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center gap-2 h-11 sm:h-10 px-4 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-white dark:bg-[#1a2230] text-[#0d121b] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto active:scale-95">
                        <span className="material-symbols-outlined text-[20px] notranslate">download</span>
                        <span>Exportar</span>
                    </button>
                    <Link href="/AuditoriaDepoStock/auditorias" className="flex items-center justify-center gap-2 h-11 sm:h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all w-full sm:w-auto active:scale-95">
                        <span className="material-symbols-outlined text-[20px] notranslate">add_circle</span>
                        <span>Nueva Auditoría</span>
                    </Link>
                </div>
            </div>

            {/* Critical Alerts Section */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 notranslate">warning</span>
                    <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">Alertas Críticas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {/* Alert 1 */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 bg-white dark:bg-[#1a2230] p-4 rounded-xl border-l-4 border-red-500 shadow-sm transition-transform hover:scale-[1.01]">
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-2.5 shrink-0">
                            <span className="material-symbols-outlined notranslate">payments</span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-[#0d121b] dark:text-white font-semibold text-sm sm:text-base">Discrepancia de alto valor</p>
                            <p className="text-[#4c669a] dark:text-gray-400 text-xs sm:text-sm">Zona B - Diferencia de -$4,500 en items electrónicos</p>
                        </div>
                        <button className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline self-center sm:self-auto">Revisar</button>
                    </div>
                    {/* Alert 2 */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 bg-white dark:bg-[#1a2230] p-4 rounded-xl border-l-4 border-orange-400 shadow-sm transition-transform hover:scale-[1.01]">
                        <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg p-2.5 shrink-0">
                            <span className="material-symbols-outlined notranslate">schedule</span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-[#0d121b] dark:text-white font-semibold text-sm sm:text-base">Auditoría Cíclica Retrasada</p>
                            <p className="text-[#4c669a] dark:text-gray-400 text-xs sm:text-sm">Pasillo 4 - Vencido hace 24 horas</p>
                        </div>
                        <Link
                            href="/AuditoriaDepoStock/auditorias?zone=Pasillo%204"
                            className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline self-center sm:self-auto"
                        >
                            Asignar
                        </Link>
                    </div>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Card 1: Accuracy */}
                <div className="bg-white dark:bg-[#1a2230] p-5 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                            <span className="material-symbols-outlined notranslate">verified</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] mr-1 notranslate">trending_up</span> +0.4%
                        </span>
                    </div>
                    <div>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm font-medium">Exactitud Inventario</p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#0d121b] dark:text-white mt-1">{kpis.accuracy}%</h3>
                    </div>
                </div>
                {/* Card 2: Economic Value */}
                <div className="bg-white dark:bg-[#1a2230] p-5 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                            <span className="material-symbols-outlined notranslate">attach_money</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] mr-1 notranslate">trending_down</span> -12%
                        </span>
                    </div>
                    <div>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm font-medium">Valor Diferencias</p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#0d121b] dark:text-white mt-1">${kpis.discrepancies}</h3>
                    </div>
                </div>
                {/* Card 3: Compliance */}
                <div className="bg-white dark:bg-[#1a2230] p-5 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                            <span className="material-symbols-outlined">task_alt</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm font-medium">Auditorías Completadas</p>
                        <div className="flex items-end gap-2 mt-1">
                            <h3 className="text-2xl lg:text-3xl font-bold text-[#0d121b] dark:text-white">{kpis.auditsCompleted}</h3>
                            <span className="text-sm text-[#4c669a] dark:text-gray-500 mb-1">Meta: 50</span>
                        </div>
                        {/* Progress Bar Mini */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-3">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(kpis.auditsCompleted / 50) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
                {/* Card 4: Correction Time */}
                <div className="bg-white dark:bg-[#1a2230] p-5 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                            <span className="material-symbols-outlined">timer</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] mr-1">arrow_downward</span> -1.5h
                        </span>
                    </div>
                    <div>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm font-medium">Tiempo Prom. Corrección</p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#0d121b] dark:text-white mt-1">4.2 Hrs</h3>
                    </div>
                </div>
            </div>

            {/* Charts & Complex Data Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Chart 1: Cycle Count Activity (2/3 width) */}
                <div className="bg-white dark:bg-[#1a2230] p-4 sm:p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm xl:col-span-2 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Resultados de Conteos Cíclicos (7 Días)</h3>
                        <button className="text-[#4c669a] dark:text-gray-400 hover:text-blue-600">
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    </div>
                    {/* Simple CSS Bar Chart Simulation */}
                    <div className="flex-1 flex items-end justify-between gap-1 sm:gap-4 h-48 sm:h-64 w-full">
                        {/* Bar Item */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full max-w-[40px] flex flex-col justify-end h-full rounded-t-sm overflow-hidden relative">
                                <div className="bg-red-400 h-[10%] w-full"></div>
                                <div className="bg-blue-600 h-[60%] w-full"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#4c669a] dark:text-gray-500 font-medium">L</span>
                        </div>
                        {/* Bar Item */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full max-w-[40px] flex flex-col justify-end h-full rounded-t-sm overflow-hidden">
                                <div className="bg-red-400 h-[5%] w-full"></div>
                                <div className="bg-blue-600 h-[80%] w-full"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#4c669a] dark:text-gray-500 font-medium">M</span>
                        </div>
                        {/* Bar Item */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full max-w-[40px] flex flex-col justify-end h-full rounded-t-sm overflow-hidden">
                                <div className="bg-red-400 h-[2%] w-full"></div>
                                <div className="bg-blue-600 h-[75%] w-full"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#4c669a] dark:text-gray-500 font-medium">X</span>
                        </div>
                        {/* Bar Item */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full max-w-[40px] flex flex-col justify-end h-full rounded-t-sm overflow-hidden">
                                <div className="bg-red-400 h-[15%] w-full"></div>
                                <div className="bg-blue-600 h-[50%] w-full"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#4c669a] dark:text-gray-500 font-medium">J</span>
                        </div>
                        {/* Bar Item */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full max-w-[40px] flex flex-col justify-end h-full rounded-t-sm overflow-hidden">
                                <div className="bg-red-400 h-[8%] w-full"></div>
                                <div className="bg-blue-600 h-[85%] w-full"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#4c669a] dark:text-gray-500 font-medium">V</span>
                        </div>
                        {/* Bar Item */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full max-w-[40px] flex flex-col justify-end h-full rounded-t-sm overflow-hidden">
                                <div className="bg-red-400 h-[0%] w-full"></div>
                                <div className="bg-blue-600 h-[40%] w-full"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#4c669a] dark:text-gray-500 font-medium">S</span>
                        </div>
                        {/* Bar Item */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full max-w-[40px] flex flex-col justify-end h-full rounded-t-sm overflow-hidden">
                                <div className="bg-red-400 h-[0%] w-full"></div>
                                <div className="bg-blue-600 h-[20%] w-full"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#4c669a] dark:text-gray-500 font-medium">D</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="size-3 bg-blue-600 rounded-full"></div>
                            <span className="text-xs sm:text-sm text-[#4c669a] dark:text-gray-400">Coincidencias</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-3 bg-red-400 rounded-full"></div>
                            <span className="text-xs sm:text-sm text-[#4c669a] dark:text-gray-400">Discrepancias</span>
                        </div>
                    </div>
                </div>

                {/* Chart 2: Stats List (1/3 width) */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Resumen por Zonas</h3>
                    <div className="flex flex-col gap-4">
                        {/* Zone Item */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-[#0d121b] dark:text-white">Zona A (Electrónica)</span>
                                <span className="text-green-600">99.1%</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: '99.1%' }}></div>
                            </div>
                        </div>
                        {/* Zone Item */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-[#0d121b] dark:text-white">Zona B (Hogar)</span>
                                <span className="text-yellow-600">94.5%</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-yellow-500 h-full rounded-full" style={{ width: '94.5%' }}></div>
                            </div>
                        </div>
                        {/* Zone Item */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-[#0d121b] dark:text-white">Zona C (Textil)</span>
                                <span className="text-green-600">98.8%</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: '98.8%' }}></div>
                            </div>
                        </div>
                        {/* Zone Item */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-[#0d121b] dark:text-white">Zona D (Frío)</span>
                                <span className="text-red-500">88.2%</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full rounded-full" style={{ width: '88.2%' }}></div>
                            </div>
                        </div>
                    </div>
                    <button className="mt-auto w-full py-2 text-blue-600 text-sm font-semibold border border-blue-600/20 rounded-lg hover:bg-blue-600/5 transition-colors">
                        Ver Reporte Completo
                    </button>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2a3441] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Auditorías Recientes</h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-[#4c669a]">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-[#4c669a]">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-[#4c669a] dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold">ID Auditoría</th>
                                <th className="px-6 py-3 font-semibold">Fecha</th>
                                <th className="px-6 py-3 font-semibold">Zona</th>
                                <th className="px-6 py-3 font-semibold">Auditor</th>
                                <th className="px-6 py-3 font-semibold">Resultado</th>
                                <th className="px-6 py-3 font-semibold">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7ebf3] dark:divide-[#2a3441]">
                            {auditorias.map((audit) => (
                                <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-[#0d121b] dark:text-white">{audit.codigo}</td>
                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">{new Date(audit.fecha_inicio).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-[#0d121b] dark:text-white">{audit.zona || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400 flex items-center gap-2">
                                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-6 bg-gray-300"></div>
                                        {audit.responsable_id || 'Sin asignar'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-green-600 font-medium">--</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${audit.estado === 'finalizada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            audit.estado === 'en_progreso' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }`}>
                                            {audit.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                                        {/* Standard Actions */}
                                        {audit.estado === 'en_progreso' ? (
                                            <>
                                                <form action={async () => {
                                                    'use server';
                                                    await closeAudit(audit.id);
                                                }}>
                                                    <button className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Finalizar">
                                                        <span className="material-symbols-outlined text-[20px]">stop_circle</span>
                                                    </button>
                                                </form>
                                                <Link href="/AuditoriaDepoStock/conteo" className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Continuar">
                                                    <span className="material-symbols-outlined text-[20px]">play_circle</span>
                                                </Link>
                                            </>
                                        ) : (
                                            <Link href={`/AuditoriaDepoStock/informes/${audit.id}`} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors" title="Ver Informe">
                                                <span className="material-symbols-outlined text-[20px]">assessment</span>
                                            </Link>
                                        )}

                                        {/* Admin CRUD Actions - Only visible if admin */}
                                        {isAdmin && (
                                            <AuditActions
                                                auditId={audit.id}
                                                currentDescription={audit.descripcion}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {auditorias.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No hay auditorías recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Bottom Spacer */}
            <div className="h-10"></div>
        </div>
    );
}

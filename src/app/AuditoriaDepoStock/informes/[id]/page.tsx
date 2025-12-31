import React from 'react';
import pool from '@/lib/db_auditoria';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';

async function getAuditReport(id: number) {
    const [auditRows] = await pool.query<RowDataPacket[]>('SELECT * FROM auditorias WHERE id = ?', [id]);
    const audit = auditRows[0];

    const [conteos] = await pool.query<RowDataPacket[]>(`
        SELECT c.*, p.nombre as producto_nombre 
        FROM conteos c 
        LEFT JOIN productos_audit p ON c.producto_sku = p.sku 
        WHERE c.auditoria_id = ?
    `, [id]);

    const totalItems = conteos.length;
    const countedItems = conteos.filter(c => c.cantidad_real !== null).length;
    const discrepancies = conteos.filter(c => c.cantidad_real !== null && c.cantidad_real !== c.cantidad_esperada);
    const findings = conteos.filter(c => c.notas);

    return { audit, totalItems, countedItems, discrepancies, findings };
}

export default async function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { audit, totalItems, countedItems, discrepancies, findings } = await getAuditReport(parseInt(id));

    if (!audit) return <div>Auditoría no encontrada</div>;

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#0d121b] dark:text-white">Informe de Auditoría</h1>
                    <p className="text-[#4c669a] dark:text-gray-400">{audit.codigo} - {audit.descripcion}</p>
                </div>
                <Link
                    href="/AuditoriaDepoStock"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-[#4c669a] dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Volver
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm">
                    <h3 className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Progreso</h3>
                    <p className="text-2xl font-bold text-[#0d121b] dark:text-white mt-1">
                        {Math.round((countedItems / totalItems) * 100) || 0}%
                    </p>
                    <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-1">{countedItems} de {totalItems} items</p>
                </div>
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm">
                    <h3 className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Discrepancias</h3>
                    <p className="text-2xl font-bold text-red-600 mt-1">{discrepancies.length}</p>
                    <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-1">Items con diferencias</p>
                </div>
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm">
                    <h3 className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Hallazgos</h3>
                    <p className="text-2xl font-bold text-orange-600 mt-1">{findings.length}</p>
                    <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-1">Notas registradas</p>
                </div>
            </div>

            {/* Discrepancies Table */}
            {discrepancies.length > 0 && (
                <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e7ebf3] dark:border-[#2a3441]">
                        <h3 className="font-bold text-[#0d121b] dark:text-white">Detalle de Discrepancias</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-[#101622] text-[#4c669a] dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-4 py-3">SKU</th>
                                    <th className="px-4 py-3">Producto</th>
                                    <th className="px-4 py-3 text-center">Esperado</th>
                                    <th className="px-4 py-3 text-center">Real</th>
                                    <th className="px-4 py-3 text-center">Dif</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e7ebf3] dark:divide-[#2a3441]">
                                {discrepancies.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-3 font-medium text-[#0d121b] dark:text-white">{item.producto_sku}</td>
                                        <td className="px-4 py-3 text-[#4c669a] dark:text-gray-400">{item.producto_nombre}</td>
                                        <td className="px-4 py-3 text-center text-[#0d121b] dark:text-white">{item.cantidad_esperada}</td>
                                        <td className="px-4 py-3 text-center text-[#0d121b] dark:text-white">{item.cantidad_real}</td>
                                        <td className="px-4 py-3 text-center font-bold text-red-600">
                                            {item.cantidad_real - item.cantidad_esperada > 0 ? '+' : ''}{item.cantidad_real - item.cantidad_esperada}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Findings List */}
            {findings.length > 0 && (
                <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e7ebf3] dark:border-[#2a3441]">
                        <h3 className="font-bold text-[#0d121b] dark:text-white">Hallazgos y Notas</h3>
                    </div>
                    <div className="divide-y divide-[#e7ebf3] dark:divide-[#2a3441]">
                        {findings.map((item) => (
                            <div key={item.id} className="p-4 flex gap-4">
                                <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 flex-shrink-0">
                                    <span className="material-symbols-outlined">flag</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#0d121b] dark:text-white">{item.producto_sku} - {item.producto_nombre}</p>
                                    <p className="text-sm text-[#4c669a] dark:text-gray-400 mt-1">{item.notas}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

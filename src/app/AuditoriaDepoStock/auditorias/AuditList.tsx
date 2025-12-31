'use client';

import React from 'react';
import { Auditoria } from '@/app/actions/auditoria';
import Link from 'next/link';

interface AuditListProps {
    audits: Auditoria[];
}

export default function AuditList({ audits }: AuditListProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'borrador': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
            case 'en_progreso': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'finalizada': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'cancelada': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (date: Date | string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e7ebf3] dark:border-[#2a3441]">
                <h2 className="text-xl font-bold text-[#0d121b] dark:text-white">Historial de Auditorías</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-[#101622] text-[#4c669a] dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3 font-medium">Código</th>
                            <th className="px-6 py-3 font-medium">Descripción</th>
                            <th className="px-6 py-3 font-medium">Tipo</th>
                            <th className="px-6 py-3 font-medium">Depósito</th>
                            <th className="px-6 py-3 font-medium">Zona / Alcance</th>
                            <th className="px-6 py-3 font-medium">Estado</th>
                            <th className="px-6 py-3 font-medium">Fecha Inicio</th>
                            <th className="px-6 py-3 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7ebf3] dark:divide-[#2a3441]">
                        {audits.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No hay auditorías registradas.
                                </td>
                            </tr>
                        ) : (
                            audits.map((audit) => (
                                <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-[#2a3441]/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#0d121b] dark:text-white">
                                        {audit.codigo}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {audit.descripcion}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 capitalize">
                                        {audit.tipo}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-xs">{audit.deposito || '-'}</span>
                                            {audit.fecha_stock && <span className="text-xs text-gray-400">{formatDate(audit.fecha_stock).split(',')[0]}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {audit.zona || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.estado)}`}>
                                            {audit.estado.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {formatDate(audit.fecha_inicio)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/AuditoriaDepoStock/conteo?auditId=${audit.id}`}
                                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            {audit.estado === 'finalizada' ? 'Ver Reporte' : 'Continuar'}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

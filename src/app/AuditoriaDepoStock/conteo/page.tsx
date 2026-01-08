import React from 'react';
import { getAuditorias, getConteos, getAuditoriaStats } from '@/app/actions/auditoria';
import AuditControls from './AuditControls';
import AuditExecution from './AuditExecution';

export default async function AuditoriaConteo({
    searchParams
}: {
    searchParams: Promise<{ auditId?: string; page?: string; search?: string }>
}) {
    const params = await searchParams;
    const auditorias = await getAuditorias();
    const page = parseInt(params.page || '1');
    const search = params.search || '';

    // Determine active audit
    let activeAudit = null;
    if (params.auditId) {
        activeAudit = auditorias.find(a => a.id === parseInt(params.auditId!));
    }

    if (!activeAudit) {
        activeAudit = auditorias.find(a => a.estado === 'en_progreso') || auditorias[0];
    }

    if (!activeAudit) {
        return (
            <div className="mx-auto max-w-7xl flex flex-col gap-6 items-center justify-center min-h-[50vh]">
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">No hay auditorías activas.</h2>
                <p className="text-gray-500">Crea una nueva auditoría desde el Dashboard para comenzar.</p>
            </div>
        );
    }

    // Parallel data fetching
    const [conteosData, stats] = await Promise.all([
        getConteos(activeAudit.id, page, 50, search),
        getAuditoriaStats(activeAudit.id)
    ]);

    return (
        <div className="mx-auto max-w-7xl flex flex-col gap-6 pb-20">
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${activeAudit.estado === 'en_progreso' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20' : 'bg-gray-100 text-gray-700 ring-gray-600/20'
                            }`}>
                            {activeAudit.estado === 'en_progreso' ? 'En Progreso' : activeAudit.estado}
                        </span>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal">Iniciado: {new Date(activeAudit.fecha_inicio).toLocaleDateString()}</p>
                    </div>
                    <h1 className="text-[#0d121b] dark:text-white text-3xl font-bold leading-tight tracking-tight">{activeAudit.codigo} - {activeAudit.zona || 'General'}</h1>
                    <p className="text-[#4c669a] dark:text-gray-400 text-sm">{activeAudit.descripcion}</p>
                </div>
                <AuditControls
                    auditId={activeAudit.id}
                    auditStatus={activeAudit.estado}
                    stats={stats}
                />
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl shadow-sm border border-[#e7ebf3] dark:border-[#2a3441] flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <span className="material-symbols-outlined notranslate">percent</span>
                    </div>
                    <div>
                        <p className="text-sm text-[#4c669a] dark:text-gray-400">Progreso</p>
                        <h3 className="text-xl font-bold text-[#0d121b] dark:text-white">{stats.progress}%</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl shadow-sm border border-[#e7ebf3] dark:border-[#2a3441] flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                        <span className="material-symbols-outlined notranslate">check_circle</span>
                    </div>
                    <div>
                        <p className="text-sm text-[#4c669a] dark:text-gray-400">Contados</p>
                        <h3 className="text-xl font-bold text-[#0d121b] dark:text-white">{stats.counted}/{stats.total}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl shadow-sm border border-[#e7ebf3] dark:border-[#2a3441] flex items-center gap-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                        <span className="material-symbols-outlined notranslate">warning</span>
                    </div>
                    <div>
                        <p className="text-sm text-[#4c669a] dark:text-gray-400">Discrepancias</p>
                        <h3 className="text-xl font-bold text-[#0d121b] dark:text-white">{stats.discrepancies}</h3>
                    </div>
                </div>
            </div>

            {/* Execution Interface */}
            <AuditExecution
                conteos={conteosData.items}
                auditId={activeAudit.id}
                auditType={activeAudit.tipo}
                totalPages={conteosData.totalPages}
                currentPage={conteosData.currentPage}
                totalItems={conteosData.totalItems}
            />
        </div>
    );
}

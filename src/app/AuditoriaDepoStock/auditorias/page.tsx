import React from 'react';
import { getZones, getCategories, getAuditorias, getStockSources } from '@/app/actions/auditoria';
import AuditManager from './AuditManager';
import AuditList from './AuditList';

export default async function AuditoriasPage() {
    const zones = await getZones();
    const categories = await getCategories();
    const audits = await getAuditorias();
    const stockSources = await getStockSources();

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-[#0d121b] dark:text-white">Gestión de Auditorías</h1>
                <p className="text-[#4c669a] dark:text-gray-400">Crea y asigna nuevas tareas de control de inventario.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <AuditManager zones={zones} categories={categories} stockSources={stockSources} />
                </div>
                <div className="lg:col-span-2">
                    <AuditList audits={audits} />
                </div>
            </div>
        </div>
    );
}

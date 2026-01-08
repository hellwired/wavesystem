'use client';
import { useState } from 'react';
import { closeAudit } from '@/app/actions/auditoria';

interface AuditControlsProps {
    auditId: number;
    auditStatus: string;
    stats?: {
        total: number;
        counted: number;
        discrepancies: number;
    };
}

export default function AuditControls({ auditId, auditStatus, stats }: AuditControlsProps) {
    const [isClosing, setIsClosing] = useState(false);

    const handleCloseAudit = async () => {
        let message = '¿Estás seguro de que deseas finalizar esta auditoría? Esta acción no se puede deshacer.';

        if (stats) {
            const incomplete = stats.total - stats.counted;
            message = `¿Estás seguro de que deseas finalizar esta auditoría?\n\nResumen:\n- Total Items: ${stats.total}\n- Contados: ${stats.counted}\n- Pendientes: ${incomplete}\n- Discrepancias: ${stats.discrepancies}`;

            if (incomplete > 0) {
                message += `\n\n⚠️ PRECAUCIÓN: Hay ${incomplete} items sin contar. Si continúa, se finalizará como incompleta.`;
            } else {
                message += `\n\nEsta acción no se puede deshacer.`;
            }
        }

        if (!confirm(message)) {
            return;
        }
        setIsClosing(true);
        try {
            await closeAudit(auditId);
        } catch (error) {
            console.error('Error closing audit:', error);
            alert('Error al finalizar la auditoría. Por favor, inténtelo de nuevo.');
        } finally {
            setIsClosing(false);
        }
    };

    if (auditStatus === 'finalizada' || auditStatus === 'cancelada') {
        return (
            <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${auditStatus === 'finalizada'
                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                    : 'bg-red-50 text-red-700 ring-red-600/20'
                    }`}>
                    {auditStatus === 'finalizada' ? 'Auditoría Finalizada' : 'Auditoría Cancelada'}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex flex-1 md:flex-none items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-[#1a2230] border border-[#e7ebf3] dark:border-[#2a3441] text-[#0d121b] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm active:scale-95">
                <span className="material-symbols-outlined mr-2 text-[20px] notranslate">pause</span>
                {auditStatus === 'pausada' ? 'Reanudar' : 'Pausar'}
            </button>
            <button
                onClick={handleCloseAudit}
                disabled={isClosing}
                className="flex flex-1 md:flex-none items-center justify-center rounded-lg h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 active:scale-95"
            >
                <span className="material-symbols-outlined mr-2 text-[20px] notranslate">check_circle</span>
                {isClosing ? 'Finalizando...' : 'Finalizar Auditoría'}
            </button>
        </div>
    );
}

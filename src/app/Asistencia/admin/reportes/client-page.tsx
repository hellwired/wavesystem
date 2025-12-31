'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getMonthlyReport, ReportSummary, DailyDetail } from '@/app/Asistencia/actions/getMonthlyReport';

const MONTHS = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
];

export default function ReportesClient() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [data, setData] = useState<ReportSummary[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<ReportSummary | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const report = await getMonthlyReport(month, year);
            setData(report);
        } catch (err) {
            console.error(err);
            setError('Error al generar el reporte.');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!data) return;

        const csvContent = [
            ['ID', 'DNI', 'Nombre', 'Dias Asistidos', 'Llegadas Tarde', 'Minutos Tarde', 'Ausencias', 'Horas Trabajadas'],
            ...data.map(item => [
                item.employeeId,
                item.dni,
                `"${item.fullName}"`,
                item.daysPresent,
                item.latenessCount,
                item.totalLateMinutes,
                item.absences,
                item.totalHoursWorked
            ])
        ].map(e => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte_asistencia_${month}_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 relative">
            {/* Cabecera / Filtros - Oculto al imprimir */}
            <div className="bg-white p-4 shadow rounded-lg print:hidden">
                <div className="mb-4">
                    <Link href="/Asistencia/admin/dashboard" className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-2 transition-colors">
                        &larr; Volver al Inicio
                    </Link>
                </div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Reportes Mensuales</h2>
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-bold mb-1">Mes</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="border p-2 rounded w-40"
                        >
                            {MONTHS.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Año</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="border p-2 rounded w-24"
                            min={2020}
                            max={2030}
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Generando...' : 'Generar Reporte'}
                    </button>
                    {data && (
                        <>
                            <button
                                onClick={() => window.print()}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            >
                                🖨️ Imprimir
                            </button>
                            <button
                                onClick={handleExport}
                                className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                            >
                                📥 Excel (CSV)
                            </button>
                        </>
                    )}
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Print Header */}
            <div className="hidden print:block mb-8">
                <h1 className="text-2xl font-bold text-center">Reporte de Asistencia</h1>
                <p className="text-center text-gray-600">
                    Periodo: {MONTHS.find(m => m.value === month)?.label} {year}
                </p>
            </div>

            {/* Tabla de Resultados */}
            {data && (
                <div className="bg-white shadow rounded-lg overflow-hidden print:shadow-none">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 print:bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider print:text-black">Empleado</th>
                                <th className="px-6 py-3 text-center font-bold text-gray-500 uppercase tracking-wider print:text-black">Días Asistidos</th>
                                <th className="px-6 py-3 text-center font-bold text-gray-500 uppercase tracking-wider print:text-black">Llegadas Tarde</th>
                                <th className="px-6 py-3 text-center font-bold text-gray-500 uppercase tracking-wider print:text-black">Ausencias</th>
                                <th className="px-6 py-3 text-center font-bold text-gray-500 uppercase tracking-wider print:text-black">Horas Trab.</th>
                                <th className="px-6 py-3 text-center font-bold text-gray-500 uppercase tracking-wider print:hidden">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No se encontraron datos para este periodo.</td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.employeeId} className="hover:bg-gray-50 print:hover:bg-white">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{item.fullName}</div>
                                            <div className="text-gray-500 text-xs font-mono">{item.dni}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-900">
                                            {item.daysPresent}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-gray-900">{item.latenessCount}</div>
                                            {item.totalLateMinutes > 0 && (
                                                <div className="text-red-500 text-xs font-semibold">({item.totalLateMinutes} min)</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.absences > 0 ? 'bg-red-100 text-red-800' : 'text-gray-500'}`}>
                                                {item.absences}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-900 font-mono">
                                            {item.totalHoursWorked.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center print:hidden">
                                            <button
                                                onClick={() => setSelectedEmployee(item)}
                                                className="text-blue-600 hover:text-blue-900 font-medium text-xs uppercase"
                                            >
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Detalles */}
            {selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">
                                Detalles: {selectedEmployee.fullName}
                            </h3>
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-0 overflow-auto flex-1">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-bold text-gray-500">Fecha</th>
                                        <th className="px-4 py-2 text-center font-bold text-gray-500">Entrada</th>
                                        <th className="px-4 py-2 text-center font-bold text-gray-500">Salida</th>
                                        <th className="px-4 py-2 text-center font-bold text-gray-500">Estado</th>
                                        <th className="px-4 py-2 text-center font-bold text-gray-500">Horas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedEmployee.details.length === 0 ? (
                                        <tr><td colSpan={5} className="p-4 text-center text-gray-500">Sin registros.</td></tr>
                                    ) : (
                                        selectedEmployee.details.map((d, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-gray-900">{d.date}</td>
                                                <td className="px-4 py-2 text-center font-mono">{d.actualStart || '-'}</td>
                                                <td className="px-4 py-2 text-center font-mono">{d.actualEnd || '-'}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${d.status === 'puntual' ? 'bg-green-100 text-green-800' :
                                                        d.status === 'tarde' ? 'bg-yellow-100 text-yellow-800' :
                                                            d.status === 'ausente' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center font-mono font-bold">{d.hoursWorked}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t bg-gray-50 text-right">
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

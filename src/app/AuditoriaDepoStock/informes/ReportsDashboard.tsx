"use client";

import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAuditPDFData, Auditoria } from "@/app/actions/auditoria";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"];

export default function ReportsDashboard({ data, initialCompletedAudits }: { data: any, initialCompletedAudits: Auditoria[] }) {
    const { discrepancyTrend, errorTypes, auditorPerformance } = data;
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const generateDashboardPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Reporte de Dashboard - Auditoría de Stock", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generado: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

        // KPIs Section
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Resumen de KPIs", 14, 45);

        // We can't easily capture Recharts as images without canvas manipulation which is tricky in pure client logic without html2canvas.
        // For now, we will output text summary.

        const kpiData = [
            ["Exactitud Global", "98.5%", "+1.2%"],
            ["Valor Discrepancias", "$1,240", "-5%"],
            ["Auditorías Finalizadas", "45", "12 esta semana"]
        ];

        autoTable(doc, {
            startY: 50,
            head: [['Métrica', 'Valor', 'Cambio']],
            body: kpiData,
        });

        // Error Types
        const errorData = errorTypes.map((e: any) => [e.name, e.value]);

        // @ts-ignore
        doc.text("Desglose de Errores", 14, doc.lastAutoTable.finalY + 15);

        autoTable(doc, {
            // @ts-ignore
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Tipo de Error', 'Cantidad']],
            body: errorData,
        });

        doc.save("dashboard-report.pdf");
    };

    const generateAuditPDF = async (audit: Auditoria) => {
        setDownloadingId(audit.id);
        try {
            const detailData = await getAuditPDFData(audit.id);
            if (!detailData) {
                alert("Error al cargar datos del reporte");
                return;
            }

            const doc = new jsPDF();

            // Header
            doc.setFontSize(18);
            doc.text(`Reporte de Auditoría: ${audit.codigo}`, 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            const statusMap: any = {
                'finalizada': 'Finalizada',
                'en_progreso': 'En Progreso',
                'cancelada': 'Cancelada'
            };
            doc.text(`Estado: ${statusMap[audit.estado] || audit.estado} | Fecha: ${new Date(audit.created_at || new Date()).toLocaleDateString()}`, 14, 28);
            if (audit.responsable_id) doc.text(`Responsable ID: ${audit.responsable_id}`, 14, 34);

            doc.line(14, 38, 196, 38);

            // Summary Stats
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text("Resumen de Hallazgos", 14, 48);

            const summary = detailData.summary;
            const summaryData = [
                ['Total Items Auditados', summary.totalItems],
                ['Conteo Verificado', summary.countedItems],
                ['Discrepancias Encontradas', summary.discrepancyCount],
                ['Exactitud', `${summary.accuracy.toFixed(2)}%`],
                ['Valor Discrepancia Absoluta', `$${summary.totalDiscrepancyValue.toFixed(2)}`]
            ];

            autoTable(doc, {
                startY: 52,
                body: summaryData,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 2 }
            });

            // Discrepancy Details
            // @ts-ignore
            let finalY = doc.lastAutoTable.finalY;

            const discrepancies = detailData.items.filter((i: any) => i.diferencia !== 0);

            if (discrepancies.length > 0) {
                doc.text("Detalle de Discrepancias", 14, finalY + 15);

                const discTable = discrepancies.map((item: any) => [
                    item.producto_sku,
                    item.producto_nombre || 'N/A',
                    item.cantidad_esperada,
                    item.cantidad_real,
                    item.diferencia > 0 ? `+${item.diferencia}` : item.diferencia,
                    item.notas || '-'
                ]);

                autoTable(doc, {
                    startY: finalY + 20,
                    head: [['SKU', 'Producto', 'Exp', 'Real', 'Dif', 'Notas']],
                    body: discTable,
                    headStyles: { fillColor: [220, 53, 69] },
                });
            } else {
                doc.setTextColor(40, 167, 69); // Green
                doc.text("✓ No se encontraron discrepancias. Inventario exacto.", 14, finalY + 15);
                doc.setTextColor(0);
            }

            // Findings images (if any URLs exist) could be listed here as links since embedding remote images in client-side jsPDF is tricky due to CORS.
            // We'll just mention them.

            doc.save(`auditoria-${audit.codigo}.pdf`);

        } catch (error) {
            console.error(error);
            alert("Error generando PDF");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Informes y Reportes</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Analice el rendimiento de su inventario.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-3 py-2 bg-white dark:bg-[#1a2230] border border-gray-300 dark:border-[#2a3441] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-[20px]">calendar_today</span> 30 días
                    </button>
                    <button
                        onClick={generateDashboardPDF}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/30 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span> Exportar Dashboard
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] flex items-center gap-4">
                    <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                        <span className="material-symbols-outlined text-xl">fact_check</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Exactitud de Inventario</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">98.5%</h3>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">+1.2% vs mes anterior</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] flex items-center gap-4">
                    <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                        <span className="material-symbols-outlined text-xl">error</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Valor de Discrepancias</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">$1,240</h3>
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">-5% vs mes anterior</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] flex items-center gap-4">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <span className="material-symbols-outlined text-xl">show_chart</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Auditorías Realizadas</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">45</h3>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">12 esta semana</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Discrepancy Trend */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441]">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Tendencia de Discrepancias (Semanal)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={discrepancyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Error Types */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441]">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Tipos de Errores Encontrados</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={errorTypes}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {errorTypes.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Auditor Performance */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Rendimiento por Auditor</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={auditorPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} domain={[90, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="audits" name="Auditorías" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar yAxisId="right" dataKey="accuracy" name="Precisión (%)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Reports Table */}
            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3441] overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-[#2a3441] flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Auditorías Finalizadas (Descargar Reporte)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#101622]/50 text-gray-600 dark:text-gray-400 text-sm">
                                <th className="p-4 font-medium">Código</th>
                                <th className="p-4 font-medium">Descripción</th>
                                <th className="p-4 font-medium">Fecha Fin</th>
                                <th className="p-4 font-medium">Responsable</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 dark:text-gray-300">
                            {initialCompletedAudits && initialCompletedAudits.length > 0 ? (
                                initialCompletedAudits.map((report) => (
                                    <tr key={report.id} className="border-b border-gray-50 dark:border-[#2a3441] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{report.codigo}</td>
                                        <td className="p-4">{report.descripcion}</td>
                                        <td className="p-4">{report.fecha_fin ? new Date(report.fecha_fin).toLocaleDateString() : '-'}</td>
                                        <td className="p-4">{report.responsable_id || 'N/A'}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => generateAuditPDF(report)}
                                                disabled={downloadingId === report.id}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium ml-auto"
                                            >
                                                {downloadingId === report.id ? (
                                                    <span className="animate-spin material-symbols-outlined text-[16px]">refresh</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                                                )}
                                                PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No hay auditorías finalizadas para mostrar reportes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign, TrendingUp, Calculator, PieChart } from 'lucide-react';

    const InputField = ({ label, value, onChange }: any) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-600">$</span>
                </div>
                <input
                    type="number"
                    min="10"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="block w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 outline-none transition-all"
                />
            </div>
        </div>
    );

export default function CostsDemoPage() {
    const [revenue, setRevenue] = useState<number>(10000);
    const [fixedCosts, setFixedCosts] = useState<number>(2000);
    const [variableCosts, setVariableCosts] = useState<number>(1500);
    const [profit, setProfit] = useState<number>(0);
    const [margin, setMargin] = useState<number>(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const calculatedProfit = revenue - fixedCosts - variableCosts;
        setProfit(calculatedProfit);
        setMargin(revenue > 0 ? (calculatedProfit / revenue) * 100 : 0);
    }, [revenue, fixedCosts, variableCosts]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-green-700 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <h1 className="text-gray-900 font-bold flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-green-700" />
                        Calculadora de Ganancias
                    </h1>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 flex justify-center items-start">
                <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Input Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-50 text-green-700 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                            <h2 className="text-lg font-bold text-gray-900">Datos Financieros</h2>
                        </div>

                        <InputField label="Ingresos Mensuales Totales" value={revenue} onChange={setRevenue} />
                        <div className="border-t border-gray-100 my-4"></div>
                        <InputField label="Costos Fijos (Alquiler, Salarios)" value={fixedCosts} onChange={setFixedCosts} />
                        <InputField label="Costos Variables (Insumos, Anuncios)" value={variableCosts} onChange={setVariableCosts} />
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {/* Main Profit Card */}
                        <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-all duration-500"></div>
                            <div className="relative">
                                <p className="text-gray-400 font-medium mb-1">Beneficio Neto</p>
                                <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    ${profit.toLocaleString()}
                                </h2>
                                <div className="mt-6 flex items-center gap-2 text-sm text-gray-300">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{profit >= 0 ? "¡Estás en verde!" : "Operando con pérdidas"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-600 uppercase font-bold tracking-wider mb-1">Margen</p>
                                <p className="text-2xl font-bold text-gray-900">{margin.toFixed(1)}%</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-600 uppercase font-bold tracking-wider mb-1">Gastos Totales</p>
                                <p className="text-2xl font-bold text-gray-900">${(fixedCosts + variableCosts).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800">
                            <PieChart className="w-5 h-5 flex-shrink-0" />
                            <p>
                                Esta demostración interactiva muestra cómo <strong>WaveSystem</strong> maneja cálculos de estado en tiempo real y actualizaciones dinámicas de UI de manera limpia y eficiente.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

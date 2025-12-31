import React from 'react';

export default function AuditoriaConfiguracion() {
    return (
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1 max-w-2xl">
                    <h1 className="text-[#0d121b] dark:text-white text-2xl lg:text-3xl font-black tracking-tight">Configuración de Conteo Cíclico</h1>
                    <p className="text-[#4c669a] dark:text-gray-400 text-sm lg:text-base leading-relaxed">
                        Define las reglas, frecuencias y metodologías para tus auditorías de inventario continuas.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-3 sm:px-4 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] bg-transparent text-[#0d121b] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold transition-all">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        <span className="hidden xs:inline">Historial</span>
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 sm:px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm shadow-blue-600/20 transition-all">
                        <span className="material-symbols-outlined text-[20px]">save</span>
                        <span>Guardar</span>
                    </button>
                </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Configuration Forms (Span 2) */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Section: Methodology */}
                    <div className="flex flex-col bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2a3441] flex justify-between items-center bg-gray-50 dark:bg-[#101622]/50">
                            <h2 className="text-[#0d121b] dark:text-white text-lg font-bold">Metodología de Conteo</h2>
                            <span className="material-symbols-outlined text-[#4c669a]" title="Información sobre metodologías">info</span>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col gap-4">
                                <label className="relative flex items-start gap-4 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] p-4 cursor-pointer hover:border-blue-600/50 transition-colors group has-[:checked]:border-blue-600 has-[:checked]:bg-blue-600/5">
                                    <div className="mt-1">
                                        <input defaultChecked className="peer sr-only" name="methodology" type="radio" />
                                        <div className="size-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                            <div className="size-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                        </div>
                                    </div>
                                    <div className="flex grow flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-blue-600 text-[20px]">analytics</span>
                                            <p className="text-[#0d121b] dark:text-white text-sm font-bold">Análisis ABC</p>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full ml-auto">Recomendado</span>
                                        </div>
                                        <p className="text-[#4c669a] dark:text-gray-400 text-sm leading-relaxed">Prioriza el conteo basado en el valor de los artículos. Los artículos "A" (alto valor) se cuentan con mayor frecuencia que los "B" o "C".</p>
                                        {/* Nested Settings for ABC */}
                                        <div className="mt-4 pt-4 border-t border-[#e7ebf3] dark:border-[#2a3441]/50 flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-[#4c669a] uppercase tracking-wider mb-1 block">Clase A (%)</label>
                                                <div className="flex items-center gap-2">
                                                    <input className="w-full bg-white dark:bg-[#1a2230] border-[#e7ebf3] dark:border-[#2a3441] rounded text-sm h-8 px-2 text-[#0d121b] dark:text-white focus:ring-blue-600 focus:border-blue-600" type="number" defaultValue="20" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-[#4c669a] uppercase tracking-wider mb-1 block">Clase B (%)</label>
                                                <div className="flex items-center gap-2">
                                                    <input className="w-full bg-white dark:bg-[#1a2230] border-[#e7ebf3] dark:border-[#2a3441] rounded text-sm h-8 px-2 text-[#0d121b] dark:text-white focus:ring-blue-600 focus:border-blue-600" type="number" defaultValue="30" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-[#4c669a] uppercase tracking-wider mb-1 block">Clase C (%)</label>
                                                <div className="flex items-center gap-2">
                                                    <input className="w-full bg-white dark:bg-[#1a2230] border-[#e7ebf3] dark:border-[#2a3441] rounded text-sm h-8 px-2 text-[#0d121b] dark:text-white focus:ring-blue-600 focus:border-blue-600" type="number" defaultValue="50" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                <label className="relative flex items-start gap-4 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] p-4 cursor-pointer hover:border-blue-600/50 transition-colors group has-[:checked]:border-blue-600 has-[:checked]:bg-blue-600/5">
                                    <div className="mt-1">
                                        <input className="peer sr-only" name="methodology" type="radio" />
                                        <div className="size-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                            <div className="size-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                        </div>
                                    </div>
                                    <div className="flex grow flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-[#4c669a] group-hover:text-blue-600 transition-colors text-[20px]">casino</span>
                                            <p className="text-[#0d121b] dark:text-white text-sm font-bold">Muestreo Aleatorio</p>
                                        </div>
                                        <p className="text-[#4c669a] dark:text-gray-400 text-sm leading-relaxed">Selección estadística aleatoria para una verificación imparcial del inventario general.</p>
                                    </div>
                                </label>
                                <label className="relative flex items-start gap-4 rounded-lg border border-[#e7ebf3] dark:border-[#2a3441] p-4 cursor-pointer hover:border-blue-600/50 transition-colors group has-[:checked]:border-blue-600 has-[:checked]:bg-blue-600/5">
                                    <div className="mt-1">
                                        <input className="peer sr-only" name="methodology" type="radio" />
                                        <div className="size-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                            <div className="size-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                        </div>
                                    </div>
                                    <div className="flex grow flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-[#4c669a] group-hover:text-blue-600 transition-colors text-[20px]">track_changes</span>
                                            <p className="text-[#0d121b] dark:text-white text-sm font-bold">Grupo de Control</p>
                                        </div>
                                        <p className="text-[#4c669a] dark:text-gray-400 text-sm leading-relaxed">Monitoreo intensivo de SKUs específicos o problemáticos definidos manualmente.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Section: Frequency & Scope */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Frequency */}
                        <div className="flex flex-col bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden h-full">
                            <div className="px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2a3441] bg-gray-50 dark:bg-[#101622]/50">
                                <h2 className="text-[#0d121b] dark:text-white text-lg font-bold">Frecuencia</h2>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Generar tareas</label>
                                    <select className="form-select bg-white dark:bg-[#1a2230] border-[#e7ebf3] dark:border-[#2a3441] rounded-lg text-sm text-[#0d121b] dark:text-white focus:ring-blue-600 focus:border-blue-600 h-11">
                                        <option>Diariamente</option>
                                        <option>Semanalmente (Lunes)</option>
                                        <option>Mensualmente (1er día)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Inicio del ciclo</label>
                                    <div className="relative">
                                        <input className="form-input block w-full bg-white dark:bg-[#1a2230] border-[#e7ebf3] dark:border-[#2a3441] rounded-lg text-sm text-[#0d121b] dark:text-white focus:ring-blue-600 focus:border-blue-600 pl-10 h-11" type="date" />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#4c669a] text-[20px]">calendar_today</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Items máximos por día</label>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded">Auto: 50</span>
                                    </div>
                                    <input className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600" max="500" min="10" type="range" defaultValue="50" />
                                    <div className="flex justify-between text-xs text-[#4c669a]">
                                        <span>10</span>
                                        <span>500</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Scope Filters */}
                        <div className="flex flex-col bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-sm overflow-hidden h-full">
                            <div className="px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2a3441] bg-gray-50 dark:bg-[#101622]/50">
                                <h2 className="text-[#0d121b] dark:text-white text-lg font-bold">Alcance y Filtros</h2>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Almacenes</label>
                                    <div className="flex flex-wrap gap-2">
                                        <label className="inline-flex items-center px-3 py-1.5 rounded-full border border-blue-600 bg-blue-600/10 cursor-pointer">
                                            <input defaultChecked className="form-checkbox text-blue-600 rounded-full border-0 bg-transparent focus:ring-0 size-4 mr-2" type="checkbox" />
                                            <span className="text-sm font-medium text-blue-600">Norte</span>
                                        </label>
                                        <label className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#e7ebf3] dark:border-[#2a3441] bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                            <input className="form-checkbox text-blue-600 rounded-full border-gray-300 focus:ring-0 size-4 mr-2" type="checkbox" />
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sur</span>
                                        </label>
                                        <label className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#e7ebf3] dark:border-[#2a3441] bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                            <input className="form-checkbox text-blue-600 rounded-full border-gray-300 focus:ring-0 size-4 mr-2" type="checkbox" />
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Este</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categorías Excluidas</label>
                                    <div className="relative">
                                        <select className="form-select w-full bg-white dark:bg-[#1a2230] border-[#e7ebf3] dark:border-[#2a3441] rounded-lg text-sm text-[#0d121b] dark:text-white focus:ring-blue-600 focus:border-blue-600 h-11">
                                            <option>Seleccionar categorías...</option>
                                            <option>Materia Prima</option>
                                            <option>Empaquetado</option>
                                            <option>Obsoleto</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded border border-red-200 dark:border-red-800/50">
                                            Dañados <button className="hover:text-red-900"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Column: Summary Panel (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 flex flex-col gap-6">
                        {/* Summary Card */}
                        <div className="flex flex-col bg-white dark:bg-[#1a2230] rounded-xl border border-[#e7ebf3] dark:border-[#2a3441] shadow-lg overflow-hidden">
                            <div className="bg-[#101622] dark:bg-black p-6 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
                                <h3 className="text-white font-bold text-lg relative z-10 mb-1">Resumen del Plan</h3>
                                <p className="text-gray-400 text-sm relative z-10">Basado en la configuración actual</p>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total SKUs</span>
                                        <span className="text-2xl font-black text-[#0d121b] dark:text-white">12,450</span>
                                    </div>
                                    <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined">inventory</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">Cobertura Anual Estimada</span>
                                        <span className="text-sm font-bold text-[#0d121b] dark:text-white">98.5%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <span className="text-xs text-gray-500 block mb-1">Items / Día</span>
                                        <span className="text-lg font-bold text-blue-600">50</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <span className="text-xs text-gray-500 block mb-1">Horas / Día</span>
                                        <span className="text-lg font-bold text-blue-600">~2.5h</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-300">
                                    <span className="material-symbols-outlined text-[18px] mt-0.5">info</span>
                                    <p className="text-xs leading-snug">Con esta configuración, los artículos de Clase A se contarán 4 veces al año.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#101622]/30 p-4 border-t border-[#e7ebf3] dark:border-[#2a3441]">
                                <button className="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all">
                                    Simular Calendario
                                </button>
                            </div>
                        </div>
                        {/* Helper Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden shadow-md">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                            <div className="relative z-10 flex flex-col gap-3">
                                <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <h4 className="font-bold text-lg">¿Necesitas ayuda?</h4>
                                <p className="text-sm text-blue-100 leading-relaxed">Aprende cómo optimizar tu estrategia ABC para reducir quiebres de stock en un 30%.</p>
                                <button className="mt-2 text-sm font-bold underline decoration-blue-300 underline-offset-4 hover:text-white transition-colors self-start">Ver Guía</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

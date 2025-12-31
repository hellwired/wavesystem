'use client';

import { login } from '@/app/actions/auth_auditoria';
import { useState } from 'react';
import { User, Lock, Info, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await login(formData);
        setLoading(false);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d121b] via-[#1a2230] to-[#0d121b] p-4 sm:p-6">
            <div className="bg-white dark:bg-[#1a2230] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-[#2a3441] transform transition-all">
                {/* Header */}
                <div className="bg-blue-600 p-8 sm:p-12 text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/40 via-blue-600 to-blue-700"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md mb-4 shadow-inner">
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-white">inventory_2</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Auditoría Stock
                        </h1>
                        <p className="text-blue-100 text-xs sm:text-sm mt-2 font-bold uppercase tracking-widest opacity-80">
                            Acceso al Sistema
                        </p>
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 text-sm flex items-start animate-in fade-in slide-in-from-top-2 duration-300">
                            <Info className="w-5 h-5 mr-3 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="username">
                                Usuario
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-[#2a3441] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 bg-gray-50 dark:bg-[#101622] font-medium"
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Ingrese su usuario"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-[#2a3441] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 bg-gray-50 dark:bg-[#101622] font-medium"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-b-white"></span>
                                    <span>Iniciando sesión...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Ingresar al Sistema</span>
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-100 dark:border-[#2a3441] text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            ¿Olvidó su contraseña? <br className="sm:hidden" />
                            <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Contacte al administrador</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

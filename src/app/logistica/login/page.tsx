'use client';

import { login } from '@/app/actions/logistica';
import { useState } from 'react';
import { Truck, User, Lock, Info, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                {/* Header Moderno con Logo CSS */}
                <div className="bg-slate-900 p-10 text-center relative overflow-hidden group">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-20 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center">
                        {/* CSS Icon: The "Cube" in Motion */}
                        <div className="relative w-12 h-12 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-45 opacity-80 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                            <div className="absolute inset-0 border-2 border-white/90 rounded-lg transform rotate-45 translate-x-1 -translate-y-1"></div>
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg transform rotate-45 scale-75"></div>
                        </div>

                        {/* Typography Logo */}
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-sans flex items-center gap-1">
                            Logis<span className="text-blue-500">tica</span>
                            <span className="w-2 h-2 bg-blue-500 rounded-full self-end mb-2 animate-pulse"></span>
                        </h1>
                        <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mt-2 font-medium">
                            Next Gen Shipping
                        </p>
                    </div>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Bienvenido de nuevo</h2>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm flex items-start">
                            <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                                Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Ingrese su usuario"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                            ) : (
                                <>
                                    Ingresar <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials Section */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center mb-3">
                                <Info className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Credenciales de Prueba</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Administrador</p>
                                    <p className="text-slate-800 font-mono">User: <span className="font-bold">demo</span></p>
                                    <p className="text-slate-800 font-mono">Pass: <span className="font-bold">demo</span></p>
                                </div>
                                <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Chofer</p>
                                    <p className="text-slate-800 font-mono">User: <span className="font-bold">chofer</span></p>
                                    <p className="text-slate-800 font-mono">Pass: <span className="font-bold">chofer</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

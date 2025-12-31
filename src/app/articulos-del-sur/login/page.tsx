'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Hardcoding basePath '/next' because relative paths are flaky with trailing slashes
            const apiPath = '/next/api/auth/login';
            console.log('Attempting login via:', apiPath);

            const res = await fetch(apiPath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data;
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error('Non-JSON response:', text);
                throw new Error(`Server returned ${res.status}: ${res.statusText}. Check console for details.`);
            }

            if (!res.ok) {
                // If server sends debug info, append it
                const debugMsg = (data.debug) ? ` (${data.debug})` : '';
                throw new Error((data.message || 'Error al iniciar sesión') + debugMsg);
            }

            // Redirect on success
            router.push('/articulos-del-sur');
            router.refresh(); // Update server components/middleware state if any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/articulos-del-sur" className="inline-flex items-center text-gray-400 hover:text-slate-900 mb-6 transition-colors font-medium">
                        <ArrowLeft size={18} className="mr-2" /> Volver a la tienda
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido de nuevo</h1>
                    <p className="text-gray-600">Ingresa tus credenciales para acceder a tu cuenta.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm font-medium"
                            >
                                <AlertCircle size={20} className="flex-shrink-0 mr-3" />
                                {error}
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link href="#" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/articulos-del-sur/registro" className="font-bold text-slate-900 hover:text-orange-600 transition-colors">
                            Crear cuenta
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

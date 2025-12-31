'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '../actions/auth';
import { Lock, User } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
            {pending ? (
                <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            ) : (
                'Iniciar Sesión'
            )}
        </button>
    );
}

const initialState = {
    error: '',
};

export default function LoginPage() {
    // @ts-ignore
    const [state, formAction] = useFormState(loginAction, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200">
            <div className="w-full max-w-md p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
                        WaveSystem POS
                    </h1>
                    <p className="text-neutral-500 text-sm">Acceso al Sistema</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                name="username"
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder-neutral-600"
                                placeholder="ej. admin"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder-neutral-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}

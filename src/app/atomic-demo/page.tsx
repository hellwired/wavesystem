'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';

// --- ATOMS (Componentes Indivisibles) ---
const InputAtom = ({ label, type, value, onChange, placeholder }: any) => (
    <div className="group relative transition-all duration-300">
        <label className="block text-xs font-medium text-gray-600 mb-1 group-hover:text-blue-500 transition-colors">
            {label} <span className="text-gray-300 text-[10px] ml-1">(Atom)</span>
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all group-hover:border-blue-300"
        />
        {/* Visual Indicator */}
        <div className="absolute inset-0 border-2 border-blue-500/0 rounded-lg pointer-events-none group-hover:border-blue-500/20 transition-all"></div>
    </div>
);

const ButtonAtom = ({ children, onClick, isLoading }: any) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="relative group w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
        <span className="flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </span>
        {/* Visual Indicator */}
        <div className="absolute inset-0 border-2 border-blue-500/0 rounded-lg pointer-events-none group-hover:border-blue-500/20 transition-all"></div>
        <span className="absolute -right-12 top-2 text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">(Atom)</span>
    </button>
);

// --- MOLECULES (Grupos de Átomos) ---
const RegisterFormMolecule = ({ onSubmit, isLoading }: any) => {
    const [formData, setFormData] = useState({ name: '', email: '' });

    return (
        <div className="group/molecule relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-green-500/30">
            <div className="absolute -top-3 left-4 px-2 bg-white text-xs font-bold text-green-700 opacity-0 group-hover/molecule:opacity-100 transition-opacity border border-green-100 rounded-full">
                Molecule: UserForm
            </div>

            <div className="space-y-4">
                <InputAtom
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                />
                <InputAtom
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                />
                <div className="pt-2">
                    <ButtonAtom onClick={() => onSubmit(formData)} isLoading={isLoading}>
                        Create Account
                    </ButtonAtom>
                </div>
            </div>
        </div>
    );
};

// --- ORGANISMS (Lógica de Negocio + Moléculas) ---
export default function AtomicDemoPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [response, setResponse] = useState<any>(null);

    const handleRegister = async (data: { name: string; email: string }) => {
        setStatus('loading');
        setResponse(null);

        try {
            // Use standard fetch to hit our Apache proxy which forwards to Node.js :3001
            const res = await fetch('/atomic-demo/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Failed to register');

            setResponse(result);
            setStatus('success');
        } catch (err: any) {
            setResponse({ error: err.message });
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col items-center justify-center p-4">
            <Link href="/" className="absolute top-8 left-8 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            <div className="group/organism relative max-w-md w-full">
                {/* Organism Visual Indicator */}
                <div className="absolute -inset-4 border-2 border-dashed border-purple-200 rounded-3xl pointer-events-none opacity-0 group-hover/organism:opacity-100 transition-opacity"></div>
                <div className="absolute -top-8 right-0 text-xs font-bold text-purple-600 opacity-0 group-hover/organism:opacity-100 transition-opacity bg-purple-50 px-3 py-1 rounded-full">
                    Organism: RegisterFeature
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Atomic Design Demo
                    </h1>
                    <p className="text-gray-600">
                        Interact with the components to visualize the architecture.
                    </p>
                </div>

                {/* The Molecule */}
                <RegisterFormMolecule onSubmit={handleRegister} isLoading={status === 'loading'} />

                {/* Status Feedback / Output */}
                {status === 'success' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start animate-in fade-in slide-in-from-bottom-2">
                        <Check className="w-5 h-5 text-green-700 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-green-900">User Created (Persisted in MySQL)</h4>
                            <pre className="mt-2 text-[10px] leading-relaxed text-green-800 bg-green-100/50 p-2 rounded border border-green-200 overflow-x-auto">
                                {JSON.stringify(response, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-red-900">Registration Failed</h4>
                            <p className="text-sm text-red-700 mt-1">{response?.error}</p>
                        </div>
                    </div>
                )}

                <div className="mt-12 grid grid-cols-3 gap-4 text-center text-[10px] text-gray-400">
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500"></div>
                        <span>Atoms</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                        <span>Molecules</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500"></div>
                        <span>Organisms</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

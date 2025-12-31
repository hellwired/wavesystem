'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Fingerprint, Eye, FileCheck, AlertTriangle } from 'lucide-react';

const LAYERS = [
    {
        id: 'encryption',
        name: 'Cifrado AES-256',
        icon: Lock,
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500/30',
        hoverBorder: 'group-hover:border-cyan-400',
        bg: 'bg-cyan-500/10',
        description: 'Tus datos se transforman en código indescifrable militar. Incluso si alguien los roba, no podrá leerlos.'
    },
    {
        id: 'access',
        name: 'Autenticación MFA',
        icon: Fingerprint,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        hoverBorder: 'group-hover:border-purple-400',
        bg: 'bg-purple-500/10',
        description: 'Doble verificación de identidad. Algo que sabes (contraseña) + Algo que tienes (celular) para entrar.'
    },
    {
        id: 'monitoring',
        name: 'Vigilancia 24/7 (SIEM)',
        icon: Eye,
        color: 'text-green-400',
        borderColor: 'border-green-500/30',
        hoverBorder: 'group-hover:border-green-400',
        bg: 'bg-green-500/10',
        description: 'Nuestros sistemas monitorean constantemente patrones sospechosos, bloqueando amenazas antes de que actúen.'
    },
    {
        id: 'compliance',
        name: 'Cumplimiento Normativo',
        icon: FileCheck,
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        hoverBorder: 'group-hover:border-yellow-400',
        bg: 'bg-yellow-500/10',
        description: 'Certificados bajo estándares internacionales (ISO 27001, PCI-DSS). Calidad y seguridad auditada.'
    }
];

export default function SecurityDemoPage() {
    const [activeLayer, setActiveLayer] = useState<string | null>(null);
    const [isAttacking, setIsAttacking] = useState(false);
    const [attackBlocked, setAttackBlocked] = useState(false);

    const handleAttack = () => {
        if (isAttacking) return;
        setIsAttacking(true);
        setAttackBlocked(false);

        // Simulate attack blocked by layer 3 (Monitoring) after 1.5s
        setTimeout(() => {
            setAttackBlocked(true);
            setActiveLayer('monitoring');
            setTimeout(() => setIsAttacking(false), 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden flex flex-col items-center justify-center relative selection:bg-cyan-500/30">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-gray-950"></div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inicio
                </Link>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-white/10 text-xs text-gray-400">
                    <Shield className="w-3 h-3 text-cyan-500" />
                    <span>Banking Grade Security Protocol</span>
                </div>
            </div>

            <main className="relative z-10 w-full max-w-5xl px-4 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                {/* Visualizer (Left) */}
                <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">

                    {/* Core Data */}
                    <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center z-50 animate-pulse">
                        <div className="text-gray-900 text-center">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-900 mb-1" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Core Data</span>
                        </div>
                    </div>

                    {/* Rings */}
                    {LAYERS.map((layer, index) => {
                        const size = 180 + (index * 80); // Increasing ring size
                        const isActive = activeLayer === layer.id;

                        return (
                            <div
                                key={layer.id}
                                onMouseEnter={() => !isAttacking && setActiveLayer(layer.id)}
                                onMouseLeave={() => !isAttacking && setActiveLayer(null)}
                                className={`
                            absolute rounded-full border-2 transition-all duration-500 cursor-pointer group flex items-center justify-center
                            ${isActive ? `${layer.borderColor} bg-opacity-10 scale-105 border-opacity-100 shadow-[0_0_30px_rgba(255,255,255,0.1)]` : 'border-white/5 bg-transparent'}
                            ${isAttacking && layer.id === 'monitoring' && attackBlocked ? 'border-red-500 animate-ping' : ''}
                        `}
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    zIndex: 40 - index
                                }}
                            >
                                {/* Ring Label/Icon */}
                                <div className={`
                            absolute -top-3 bg-gray-950 px-2 flex items-center gap-2 transition-all duration-300
                            ${isActive ? 'opacity-100 scale-110' : 'opacity-50 scale-100'}
                        `}>
                                    <layer.icon className={`w-4 h-4 ${layer.color}`} />
                                    <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                        {layer.name}
                                    </span>
                                </div>

                                {/* Decoration lines */}
                                <div className={`absolute inset-0 rounded-full border border-dashed border-white/5 animate-[spin_${20 + index * 5}s_linear_infinite] pointer-events-none`}></div>
                            </div>
                        );
                    })}

                    {/* Attack Simulation Particle */}
                    {isAttacking && (
                        <div
                            className={`absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_red] z-50 transition-all duration-[1500ms] ease-in`}
                            style={{
                                top: '50%',
                                right: attackBlocked ? '35%' : '-10%', // Move from outside towards center, stop at monitoring layer (approx 35%)
                                opacity: attackBlocked ? 0 : 1, // Corrected logic: start invisible? No. Start visible. Fade out upon block?
                                transform: 'translateY(-50%)'
                            }}
                        ></div>
                    )}
                    {/* Fix Attack Animation: simpler approach */}
                    {isAttacking && !attackBlocked && (
                        <div className="absolute top-1/2 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping z-50 translate-x-12" />
                    )}
                </div>

                {/* Info Panel (Right) */}
                <div className="w-full max-w-sm space-y-8">
                    <div className="transition-all duration-300 min-h-[160px]">
                        {activeLayer ? (
                            <div className="animate-in fade-in slide-in-from-right-4">
                                <h2 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${LAYERS.find(l => l.id === activeLayer)?.color}`}>
                                    {React.createElement(LAYERS.find(l => l.id === activeLayer)?.icon as any, { className: 'w-6 h-6' })}
                                    {LAYERS.find(l => l.id === activeLayer)?.name}
                                </h2>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {LAYERS.find(l => l.id === activeLayer)?.description}
                                </p>
                            </div>
                        ) : (
                            <div className="text-gray-600 flex flex-col items-start justify-center h-full">
                                <h2 className="text-2xl font-bold text-gray-600 mb-2">Arquitectura Blindada</h2>
                                <p>Pasa el mouse sobre los anillos para inspeccionar cada capa de nuestras defensas.</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <button
                            onClick={handleAttack}
                            disabled={isAttacking}
                            className="w-full py-4 bg-gray-900 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAttacking ? (
                                <>
                                    <AlertTriangle className="w-5 h-5 animate-bounce" />
                                    <span>Interceptando Amenaza...</span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-5 h-5 group-hover:text-red-300" />
                                    <span>Simular Ciberataque</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}

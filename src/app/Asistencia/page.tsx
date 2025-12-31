'use client';

import { useState, useEffect } from 'react';
import { registrarAsistencia } from '@/app/actions/asistencia';

export default function AsistenciaPage() {
    const [dni, setDni] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleNumber = (num: string) => {
        if (dni.length < 15) setDni(prev => prev + num);
        if (status !== 'idle') resetStatus();
    };

    const handleDelete = () => {
        setDni(prev => prev.slice(0, -1));
        resetStatus();
    };

    const handleClear = () => {
        setDni('');
        resetStatus();
    };

    const resetStatus = () => {
        setStatus('idle');
        setMessage('');
    };

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const handleSubmit = async (confirm: boolean = false) => {
        if (!dni && !confirm) return;
        setStatus('loading');

        try {
            // Si es confirmación, usamos el DNI que ya estaba en el estado (o lo pasamos si fuera necesario, pero aquí el state dni no cambia)
            const result = await registrarAsistencia(dni, confirm);

            if (result.requiresConfirmation) {
                setConfirmMessage(result.message);
                setShowConfirm(true);
                setStatus('idle'); // Volver a idle para permitir interacción con modal
            } else if (result.success) {
                setDni('');
                setShowConfirm(false);
                setStatus('success');
                setMessage(result.message);
                setTimeout(() => {
                    resetStatus();
                }, 4000);
            } else {
                setDni('');
                setShowConfirm(false);
                setStatus('error');
                setMessage(result.message);
                setTimeout(resetStatus, 4000);
            }
        } catch (error) {
            setDni('');
            setShowConfirm(false);
            setStatus('error');
            setMessage('Error de conexión');
            setTimeout(resetStatus, 4000);
        }
    };

    // Keyboard Support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (status === 'loading') return;

            // Si el modal está abierto, manejar Enter/Esc para confirmar/cancelar
            if (showConfirm) {
                if (e.key === 'Enter') handleSubmit(true);
                if (e.key === 'Escape') {
                    setShowConfirm(false);
                    setDni('');
                    resetStatus();
                }
                return;
            }

            // Numbers 0-9
            if (/^[0-9]$/.test(e.key)) {
                handleNumber(e.key);
            }
            // Enter -> Submit
            else if (e.key === 'Enter') {
                handleSubmit(false);
            }
            // Backspace -> Delete last char
            else if (e.key === 'Backspace') {
                handleDelete();
            }
            // Delete/Escape -> Clear all
            else if (e.key === 'Delete' || e.key === 'Escape') {
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dni, status, showConfirm]);

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

    return (
        <div className="flex flex-col h-screen w-screen bg-slate-900 text-white font-sans overflow-hidden relative">

            {/* Modal de Confirmación */}
            {showConfirm && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 p-6 rounded-lg shadow-2xl border border-slate-600 max-w-md w-full text-center">
                        <h3 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Confirmación Requerida</h3>
                        <p className="text-lg mb-8">{confirmMessage}</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    setDni('');
                                    resetStatus();
                                }}
                                className="px-6 py-3 bg-slate-600 rounded hover:bg-slate-500 font-bold"
                            >
                                NO (Cancelar)
                            </button>
                            <button
                                onClick={() => handleSubmit(true)}
                                className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500 font-bold"
                            >
                                SÍ (Confirmar)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Compacto - Max 60-70px */}
            <div className="flex-none p-2 flex flex-col items-center justify-center bg-slate-800 shadow-md z-10">
                {status === 'success' || status === 'error' ? (
                    <div className={`${status === 'success' ? 'bg-green-600' : 'bg-red-600'} px-4 py-1 rounded w-full text-center`}>
                        <p className="font-bold text-sm truncate">{message}</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-sm text-gray-400 uppercase tracking-widest">Control de Asistencia</h1>
                        <div className="text-3xl font-mono font-bold tracking-widest h-8 text-white mt-1">
                            {dni || <span className="text-gray-600 opacity-50">_ _ _ _ _ _ _ _</span>}
                        </div>
                    </>
                )}
            </div>

            {/* Keypad & Action - Flex Grow to fill rest */}
            <div className="flex-1 flex flex-col md:flex-row p-1 gap-1">

                {/* Numpad (Left on Desktop, Top on Mobile) - Takes 75% width on desktop */}
                <div className="flex-1 md:flex-[3] grid grid-cols-3 gap-1 h-full">
                    {keys.map((k) => (
                        <button
                            key={k}
                            onClick={() => {
                                if (k === 'C') handleClear();
                                else if (k === '⌫') handleDelete();
                                else handleNumber(k);
                            }}
                            className={`
                rounded text-2xl font-bold flex items-center justify-center transition-opacity active:opacity-50
                ${k === 'C' ? 'bg-red-900/40 text-red-200' :
                                    k === '⌫' ? 'bg-yellow-900/40 text-yellow-200' :
                                        'bg-slate-700 text-white'}
              `}
                        >
                            {k}
                        </button>
                    ))}
                </div>

                {/* Action Button (Right on Desktop, Bottom on Mobile) - Takes 25% width on desktop */}
                <div className="h-20 md:h-full md:flex-1 flex flex-col justify-center">
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={status === 'loading' || !dni}
                        className={`
              h-full w-full rounded font-bold text-white text-lg flex items-center justify-center shadow-lg uppercase 
              md:[writing-mode:vertical-lr]
              ${status === 'loading' ? 'bg-gray-600' : 'bg-blue-600 active:bg-blue-500'}
            `}
                    >
                        {status === 'loading' ? '...' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
}

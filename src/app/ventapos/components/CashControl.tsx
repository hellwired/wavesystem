'use client';

import React, { useState } from 'react';
import { openSession, closeSession } from '../actions/cash-session';
import { Lock, Unlock, DollarSign } from 'lucide-react';

interface CashControlProps {
    userId: number;
    cashRegisterId: number;
    onSessionChange: (isOpen: boolean) => void;
    isOpen: boolean;
    sessionId?: number;
}

export default function CashControl({ userId, cashRegisterId, onSessionChange, isOpen, sessionId }: CashControlProps) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleOpen = async () => {
        setLoading(true);
        const res = await openSession(userId, cashRegisterId, Number(amount));
        if (res.success) {
            onSessionChange(true);
        } else {
            setError(res.error as string);
        }
        setLoading(false);
    };

    const handleClose = async () => {
        if (!sessionId) return;
        setLoading(true);
        const res = await closeSession(sessionId, Number(amount));
        if (res.success) {
            onSessionChange(false);
            alert(`Caja cerrada.\nCalculado: ${res.summary?.calculatedAmount}\nDiferencia: ${res.summary?.difference}`);
        } else {
            setError(res.error as string);
        }
        setLoading(false);
    };

    if (!isOpen) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm mx-auto mt-20 text-center space-y-4">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <Unlock className="w-8 h-8 text-neutral-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Apertura de Caja</h2>
                <p className="text-neutral-400 text-sm">Ingresa el monto inicial en efectivo para comenzar a operar.</p>

                <div className="w-full relative">
                    <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
                    <input
                        type="number"
                        className="w-full pl-9 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleOpen}
                    disabled={loading || !amount}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all"
                >
                    {loading ? 'Abriendo...' : 'Abrir Caja'}
                </button>
                {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
        );
    }

    // If Open, showing "Close" option usually in a settings modal or separate view. 
    // For demo, maybe a small button?
    return (
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
            <h3 className="text-white font-bold mb-2">Control de Caja</h3>
            <p className="text-xs text-neutral-400 mb-2">Sesión ID: {sessionId}</p>
            <input
                type="number"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white mb-2 text-sm"
                placeholder="Monto Cierre Real"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button
                onClick={handleClose}
                className="w-full py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg text-sm hover:bg-red-900/40"
            >
                Cerrar Caja
            </button>
        </div>
    );
}

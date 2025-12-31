'use client';

import React, { useState } from 'react';
import { useCartStore } from '../store/cart-store';
import { createOrder } from '../actions/sales';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { PaymentMethodEnum } from '../schemas';
import Ticket from './Ticket';

interface PaymentModalProps {
    onClose: () => void;
    userId: number; // Current logged user
    sessionId: number; // Current cash session
}

export default function PaymentModal({ onClose, userId, sessionId }: PaymentModalProps) {
    const { items, total, clearCart } = useCartStore();
    const amountToPay = total();

    const [method, setMethod] = useState<'CASH' | 'CARD' | 'QR' | 'TRANSFER' | 'CURRENT_ACCOUNT'>('CASH');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        setError(null);

        // Map items to schema
        const orderItems = items.map(i => ({
            productId: i.id!,
            quantity: i.quantity,
            priceAtSale: i.salePrice,
            subtotal: i.subtotal
        }));

        // Simple full payment for now. Complex split payment UI would take more time.
        const payments = [{
            method: method,
            amount: amountToPay
        }];

        const res = await createOrder({
            sessionId,
            userId,
            items: orderItems,
            payments: payments,
            total: amountToPay,
            status: 'COMPLETED'
        });

        if (res.success) {
            setSuccess(true);
            // Removed setTimeout for clearing cart and closing, now handled by buttons
        } else {
            setError(res.error as string);
            setProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-neutral-900 border border-emerald-500 rounded-2xl p-8 flex flex-col items-center animate-in zoom-in duration-300 max-w-sm text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">¡Venta Exitosa!</h2>
                    <p className="text-neutral-400 mb-6">¿Desea imprimir el ticket?</p>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => {
                                clearCart();
                                onClose();
                            }}
                            className="flex-1 py-3 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-700 font-medium"
                        >
                            Nuevo (ESC)
                        </button>
                        <button
                            onClick={() => {
                                window.print();
                                // Optional: clear and close after print or let user do it manually
                            }}
                            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 font-bold shadow-lg shadow-emerald-900/20"
                        >
                            Imprimir (F1)
                        </button>
                    </div>

                    {/* Invisible Ticket for Printing */}
                    <Ticket
                        data={{
                            shopName: 'WAVESYSTEM POS',
                            orderId: Date.now(), // Placeholder, ideally get real ID from res
                            date: new Date().toLocaleString(),
                            items: items.map(i => ({
                                description: i.description,
                                quantity: i.quantity,
                                price: i.salePrice,
                                subtotal: i.subtotal
                            })),
                            total: amountToPay,
                            paymentMethod: method,
                            cashierName: 'Cajero' // Placeholder
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 w-full max-w-md rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                    <h2 className="text-lg font-bold text-white">Completar Venta</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-neutral-500 mb-1">Total a Pagar</p>
                        <div className="text-4xl font-bold text-emerald-400 font-mono">
                            ${amountToPay.toFixed(2)}
                        </div>
                    </div>

                    {/* Methods */}
                    <div className="grid grid-cols-3 gap-2">
                        {['CASH', 'CARD', 'QR', 'TRANSFER'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMethod(m as any)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${method === m
                                    ? 'bg-emerald-500/[0.1] border-emerald-500 text-emerald-400'
                                    : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-neutral-950 border-t border-neutral-800">
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full py-4 text-center bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Procesando...' : 'Confirmar Pago (Enter)'}
                    </button>
                </div>
            </div>
        </div>
    );
}

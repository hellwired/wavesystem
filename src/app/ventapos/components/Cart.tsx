'use client';

import React, { useState } from 'react';
import { useCartStore } from '../store/cart-store';
import { Trash2, Plus, Minus, CreditCard, ShoppingCart } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function Cart() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
    const cartTotal = total();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-neutral-900/80">
            <div className="p-4 border-b border-neutral-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-400" />
                    Carrito Actual
                </h2>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-2 opacity-50">
                        <ShoppingCart className="w-10 h-10" />
                        <p className="text-sm">El carrito está vacío</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex flex-col bg-neutral-950/50 p-3 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors animate-in slide-in-from-right-2 duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-neutral-200 line-clamp-1">{item.description}</span>
                                <button
                                    onClick={() => removeItem(item.id!)}
                                    className="text-neutral-600 hover:text-red-400 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 bg-neutral-900 rounded-md p-1 border border-neutral-800">
                                    <button
                                        onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                                        className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs w-6 text-center font-mono">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                                        className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-emerald-400 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-bold text-emerald-400 font-mono">
                                        ${Number(item.subtotal).toFixed(2)}
                                    </div>
                                    <div className="text-[10px] text-neutral-600">
                                        ${Number(item.salePrice).toFixed(2)} c/u
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer / Checkout */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-neutral-400">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white items-end">
                        <span>Total</span>
                        <span className="text-2xl text-emerald-400">${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={clearCart}
                        className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-400 hover:bg-red-900/20 hover:text-red-400 hover:border hover:border-red-900/50 transition-all font-medium text-sm"
                    >
                        Cancelar (ESC)
                    </button>
                    <button
                        onClick={() => setIsPaymentOpen(true)}
                        disabled={items.length === 0}
                        className="px-4 py-3 rounded-xl bg-emerald-500 text-neutral-950 hover:bg-emerald-400 active:bg-emerald-600 transition-all font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CreditCard className="w-4 h-4" />
                        Cobrar (F1)
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentOpen && (
                <PaymentModal
                    onClose={() => setIsPaymentOpen(false)}
                    userId={1} // TODO: Get from auth context
                    sessionId={1} // TODO: Get from CashSession context
                />
            )}
        </div>
    );
}

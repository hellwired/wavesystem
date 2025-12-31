'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">¡Gracias por tu compra!</h2>
                    <p className="text-gray-600 mb-8">
                        Tu pedido #ADS-2025-8842 ha sido confirmado. Te enviamos un email con los detalles del envío.
                    </p>
                    <Link href="/articulos-del-sur" className="inline-block w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                        Volver al Inicio
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-100 -z-10"></div>
                <div className={`absolute left-0 top-1/2 h-1 bg-orange-500 -z-10 transition-all duration-500`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                {[
                    { num: 1, icon: User, label: 'Datos' },
                    { num: 2, icon: Truck, label: 'Envío' },
                    { num: 3, icon: CreditCard, label: 'Pago' }
                ].map((s) => (
                    <div key={s.num} className="flex flex-col items-center bg-gray-50 px-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${step >= s.num ? 'bg-orange-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                            <s.icon size={20} />
                        </div>
                        <span className={`text-sm font-medium ${step >= s.num ? 'text-slate-900' : 'text-gray-400'}`}>{s.label}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Información Personal</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                        <input type="text" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                        <input type="text" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input type="email" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                        <input type="tel" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Shipping */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Dirección de Envío</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Calle y Número</label>
                                        <input type="text" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                                        <input type="text" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                                        <input type="text" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Notas de envío (opcional)</label>
                                        <textarea className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" rows={3}></textarea>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Método de Pago</h2>
                                <div className="space-y-6">
                                    <div className="p-4 border border-orange-200 bg-orange-50 rounded-xl flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        </div>
                                        <span className="font-medium text-slate-900">Tarjeta de Crédito / Débito</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Tarjeta</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Vencimiento</label>
                                            <input type="text" placeholder="MM/AA" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                                            <input type="text" placeholder="123" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre en la tarjeta</label>
                                            <input type="text" className="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center text-gray-600 hover:text-slate-900 font-medium transition-colors"
                                >
                                    <ArrowLeft size={20} className="mr-2" /> Volver
                                </button>
                            ) : (
                                <Link href="/articulos-del-sur/carrito" className="flex items-center text-gray-600 hover:text-slate-900 font-medium transition-colors">
                                    <ArrowLeft size={20} className="mr-2" /> Volver al Carrito
                                </Link>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

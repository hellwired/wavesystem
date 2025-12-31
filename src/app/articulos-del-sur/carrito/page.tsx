'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            title: 'Smart TV 55" 4K UHD Samsung Series 7',
            price: 850000,
            image: 'https://placehold.co/200x150/png?text=Smart+TV',
            quantity: 1
        },
        {
            id: '3',
            title: 'Aire Acondicionado Split Inverter 3000F',
            price: 950000,
            image: 'https://placehold.co/200x150/png?text=Aire+Split',
            quantity: 1
        }
    ]);

    const updateQuantity = (id: string, change: number) => {
        setCartItems(items => items.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping logic could go here
    const total = subtotal + shipping;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Tu Carrito de Compras</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                    <p className="text-gray-600 text-xl mb-6">Tu carrito está vacío.</p>
                    <Link href="/articulos-del-sur/productos" className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Volver a la tienda
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-6">
                        {cartItems.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                            >
                                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                    <p className="text-orange-600 font-bold">${item.price.toLocaleString()}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Resumen del Pedido</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span className="text-green-700 font-medium">Gratis</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cupón de descuento</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Tag size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Ingresa tu código"
                                            className="pl-10 w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                                        Aplicar
                                    </button>
                                </div>
                            </div>

                            <Link href="/articulos-del-sur/checkout" className="w-full flex items-center justify-center py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30">
                                Iniciar Compra <ArrowRight size={20} className="ml-2" />
                            </Link>

                            <div className="mt-6 text-center">
                                <Link href="/articulos-del-sur/productos" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                                    Continuar comprando
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

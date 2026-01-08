'use client';
import { useState } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product: {
        id: number;
        name: string;
        stock_deposito: number;
    } | null;
}

export default function TransferModal({ isOpen, onClose, onSuccess, product }: TransferModalProps) {
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const qty = Number(quantity);

        if (qty <= 0) return alert('La cantidad debe ser mayor a 0');
        if (qty > product.stock_deposito) return alert('No hay suficiente stock en el depósito');

        setLoading(true);
        try {
            const res = await fetch('/next/api/stock/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product.id,
                    from_deposito_id: 1, // Depósito Central
                    to_deposito_id: 2,   // Local
                    quantity: qty
                })
            });

            if (res.ok) {
                alert('Transferencia realizada con éxito');
                onSuccess();
                onClose();
            } else {
                const err = await res.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la transferencia');
        } finally {
            setLoading(false);
            setQuantity('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Transferir al Local</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <p className="text-sm text-orange-600 font-bold mb-1">Stock Disponible en Depósito</p>
                        <p className="text-2xl font-bold text-orange-700">{product.stock_deposito} unidades</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad a transferir
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max={product.stock_deposito}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-mono text-lg"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 justify-center py-2">
                            <span className="font-bold">Depósito Central</span>
                            <ArrowRight size={16} />
                            <span className="font-bold text-slate-900">Local Venta</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || Number(quantity) > product.stock_deposito}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar Transferencia'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

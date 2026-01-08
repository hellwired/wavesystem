'use client';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Smartphone, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_local: number;
    stock_deposito: number;
    category_name: string;
}

interface CartItem extends Product {
    quantity: number;
}

export default function POSPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Checkout States
    const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Payment
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'mercado_pago'>('cash');
    const [installments, setInstallments] = useState(1);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/next/api/products');
            if (res.ok) {
                const data = await res.json();
                // Solo mostrar productos con stock en Local Uruguay > 0 y filtrar duplicados si los hubiera
                setProducts(data.filter((p: any) => Number(p.stock_local) > 0));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // Chequear stock max
                if (existing.quantity >= product.stock_local) return prev;
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty < 1) return item;
                if (newQty > item.stock_local) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleCheckout = async () => {
        if (!confirm('¿Confirmar venta?')) return;
        setProcessing(true);

        try {
            const res = await fetch('/next/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    payment: {
                        method: paymentMethod,
                        installments: paymentMethod === 'credit_card' ? installments : 1
                    },
                    total: cartTotal
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('¡Venta realizada con éxito! 🎉');
                router.push('/articulos-del-sur/admin/orders');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            {/* Left: Product Grid */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <Link href="/articulos-del-sur/admin/orders" className="text-gray-400 hover:text-slate-800 flex items-center gap-1 mb-1 text-sm">
                            <ArrowLeft size={16} /> Volver a Ventas
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Nueva Venta (POS)</h1>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 gap-3 content-start">
                    {loading ? (
                        <div className="col-span-3 flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" /></div>
                    ) : filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left flex flex-col justify-between h-32 group"
                        >
                            <div>
                                <h3 className="font-medium text-slate-800 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">{product.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">{product.category_name}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="font-mono font-bold text-lg">${Number(product.price).toLocaleString()}</span>
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded border border-green-200">Local: {product.stock_local}</span>
                                    <span className="text-[10px] text-gray-500 font-bold">Dep: {product.stock_deposito}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="col-span-3 text-center text-gray-400 py-12">No hay productos disponibles en Local Uruguay</div>
                    )}
                </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="w-96 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <h2 className="font-bold flex items-center gap-2"><ShoppingCart size={20} /> Carrito de Venta</h2>
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-sm text-slate-200">{cart.length} items</span>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                            <ShoppingCart size={48} className="opacity-20" />
                            <p>El carrito está vacío</p>
                        </div>
                    ) : cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="font-medium text-sm truncate text-slate-800">{item.name}</p>
                                <p className="text-xs text-gray-500">${Number(item.price).toLocaleString()} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded hover:bg-gray-100">-</button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded hover:bg-gray-100">+</button>
                                <button onClick={() => removeFromCart(item.id)} className="ml-1 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Total a Pagar</span>
                        <span className="text-2xl font-bold text-slate-900">${cartTotal.toLocaleString()}</span>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border ${paymentMethod === 'cash' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Banknote size={20} className="mb-1" />
                            <span className="text-[10px] font-bold">EFECTIVO</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('credit_card')}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border ${paymentMethod === 'credit_card' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <CreditCard size={20} className="mb-1" />
                            <span className="text-[10px] font-bold">TARJETA</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('mercado_pago')}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border ${paymentMethod === 'mercado_pago' ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Smartphone size={20} className="mb-1" />
                            <span className="text-[10px] font-bold">MP</span>
                        </button>
                    </div>

                    {/* Installments Selector (Only for Credit Card) */}
                    {paymentMethod === 'credit_card' && (
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Cuotas</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 3, 6, 12].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setInstallments(n)}
                                        className={`py-1 rounded text-sm font-bold border ${installments === n ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200'}`}
                                    >
                                        {n}x
                                    </button>
                                ))}
                            </div>
                            <div className="mt-2 text-right text-xs text-gray-500">
                                Valor cuota: <span className="font-bold text-slate-800">${(cartTotal / installments).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                        {processing ? 'Procesando...' : 'Confirmar Venta'}
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { compressImage } from '@/lib/imageUtils';

interface Category {
    id: number;
    name: string;
}

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form States
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [stock, setStock] = useState(initialData?.stock || '');
    const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
    const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.is_featured));
    const [isOffer, setIsOffer] = useState(Boolean(initialData?.is_offer));
    const [discountPercentage, setDiscountPercentage] = useState(initialData?.discount_percentage || '');
    const [offerExpiresAt, setOfferExpiresAt] = useState(initialData?.offer_expires_at ? new Date(initialData.offer_expires_at).toISOString().split('T')[0] : '');

    useEffect(() => {
        fetch('/next/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Error loading categories:', err));
    }, []);

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                setLoading(true);
                // 1. Compress in browser
                const compressedBlob = await compressImage(file);

                // 2. Upload to server
                const formData = new FormData();
                formData.append('file', compressedBlob);

                const res = await fetch('/next/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    setImageUrl(data.url);
                } else {
                    alert('Error subiendo imagen');
                }
            } catch (error) {
                console.error('Error processing image:', error);
                alert('Error al procesar la imagen');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category_id: Number(categoryId) || null,
            image_url: imageUrl,
            is_featured: isFeatured,
            is_offer: isOffer,
            discount_percentage: Number(discountPercentage) || 0,
            offer_expires_at: offerExpiresAt || null
        };

        try {
            const url = isEditing
                ? `/next/api/products/${initialData.id}`
                : '/next/api/products';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Error al guardar');

            router.push('/articulos-del-sur/admin/products');
            router.refresh();
        } catch (error) {
            alert('Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/articulos-del-sur/admin/products"
                    className="flex items-center text-gray-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Volver
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Producto</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                            placeholder="Ej. Smart TV Samsung 55''"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Precio</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Stock Disponible</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                            min="0"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Categoría</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                        >
                            <option value="">Seleccionar Categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Imagen del Producto</label>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-orange-50 file:text-orange-700
                                        hover:file:bg-orange-100
                                    "
                                />
                            </div>

                            {/* Preview or URL input fallback */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all text-sm"
                                    placeholder="O ingresa una URL externa..."
                                />
                            </div>

                            {imageUrl && (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={imageUrl.startsWith('http') ? imageUrl : `/next/${imageUrl}`}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                            placeholder="Detalles técnicos del producto..."
                        />
                    </div>

                    <div className="col-span-2 flex flex-col gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Marcar como producto destacado (aparecerá en el Home)</span>
                        </div>

                        <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                            <input
                                type="checkbox"
                                checked={isOffer}
                                onChange={(e) => setIsOffer(e.target.checked)}
                                className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Es una Oferta</span>
                        </div>

                        {isOffer && (
                            <div className="ml-9 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Porcentaje de Descuento (%)</label>
                                    <input
                                        type="number"
                                        value={discountPercentage}
                                        onChange={(e) => setDiscountPercentage(e.target.value)}
                                        min="0"
                                        max="100"
                                        className="w-32 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-green-500 outline-none transition-all"
                                        placeholder="Ej. 20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Oferta válida hasta</label>
                                    <input
                                        type="date"
                                        value={offerExpiresAt}
                                        onChange={(e) => setOfferExpiresAt(e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

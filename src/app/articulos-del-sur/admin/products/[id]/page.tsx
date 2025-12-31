'use client';
import { useEffect, useState, use } from 'react';
import ProductForm from '../../components/ProductForm';
import { Loader2 } from 'lucide-react';

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params); // Unwrap params with React.use()
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/next/api/products/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => setProduct(data))
            .catch(err => alert('Error cargando producto'))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;
    if (!product) return <div>Producto no encontrado</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Editar Producto</h1>
            <ProductForm initialData={product} isEditing={true} />
        </div>
    );
}

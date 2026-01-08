'use client';
import { use, useState, useEffect } from 'react';
import ProductForm from '../../components/ProductForm';

export default function EditDepositoProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/next/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Error loading product');
                return res.json();
            })
            .then(data => setProduct(data))
            .catch(err => alert('Error cargando producto'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!product) return <div>No encontrado</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Editar Artículo (Depósito)</h1>
            <ProductForm
                initialData={product}
                isEditing={true}
                redirectUrl="/articulos-del-sur/admin/depositos"
            />
        </div>
    );
}

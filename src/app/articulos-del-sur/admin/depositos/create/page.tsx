'use client';
import ProductForm from '../../components/ProductForm';

export default function CreateDepositoProductPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Alta de Artículo en Depósito</h1>
            <p className="text-gray-500 mb-8">La mercadería ingresada se asignará automáticamente al stock del Depósito Central.</p>

            <ProductForm
                redirectUrl="/articulos-del-sur/admin/depositos"
            />
        </div>
    );
}

import Link from 'next/link';
import { getProducts } from '../../actions/products';
import { ProductsDataTable } from './data-table';
import { columns } from './columns';
import { Product } from './types';

export default async function AdminProductsPage() {
    // Fetch data server-side
    const res = await getProducts();
    // Force cast because we know DB IDs are present, but shared schema says optional
    const data = (res.success && res.data ? res.data : []) as unknown as Product[];

    return (
        <div className="container mx-auto py-10 text-neutral-200">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/ventapos/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-800 text-neutral-500 hover:text-emerald-400 transition-colors" title="Volver al Dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        Administración de Productos
                    </h1>
                </div>
                <p className="text-neutral-500 pl-12">
                    Gestiona tu catálogo, precios y stock de manera eficiente.
                </p>
            </div>

            <ProductsDataTable columns={columns} data={data} />
        </div>
    );
}

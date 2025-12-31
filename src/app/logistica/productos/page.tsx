import { getProducts, createProduct } from '@/app/actions/logistica';

export default async function ProductosPage() {
    const products = await getProducts();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Inventario de Productos</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Nuevo Producto</h2>
                <form action={createProduct} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" name="nombre" placeholder="Nombre Producto" required className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SKU</label>
                        <input type="text" name="sku" placeholder="SKU-001" className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" name="stock" placeholder="0" required className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <input type="number" step="0.01" name="precio" placeholder="0.00" required className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reorden</label>
                        <input type="number" name="punto_reorden" placeholder="10" className="w-full border p-2 rounded mt-1" />
                    </div>

                    {/* Dimensiones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Largo (cm)</label>
                        <input type="number" step="0.1" name="largo" placeholder="0" className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ancho (cm)</label>
                        <input type="number" step="0.1" name="ancho" placeholder="0" className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alto (cm)</label>
                        <input type="number" step="0.1" name="alto" placeholder="0" className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                        <input type="number" step="0.1" name="peso" placeholder="0" className="w-full border p-2 rounded mt-1" />
                    </div>

                    <div className="md:col-span-2 flex items-end">
                        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Agregar Producto</button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <th className="px-6 py-3 border-b">SKU</th>
                            <th className="px-6 py-3 border-b">Producto</th>
                            <th className="px-6 py-3 border-b">Dimensiones</th>
                            <th className="px-6 py-3 border-b">Stock</th>
                            <th className="px-6 py-3 border-b">Precio</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b text-sm font-mono text-gray-500">{product.sku || '-'}</td>
                                <td className="px-6 py-4 border-b font-medium">{product.nombre}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-500">
                                    {product.largo}x{product.ancho}x{product.alto} cm <br />
                                    {product.peso} kg
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < product.punto_reorden ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-b">${product.precio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

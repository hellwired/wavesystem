import { getMotos, createMoto, getUsers } from '@/app/actions/logistica';

export default async function MotosPage() {
    const motos = await getMotos();
    const users = await getUsers();
    // Filter users who are likely drivers (assuming permission level 2 or similar, or just list all for now)
    const potentialDrivers = users;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Flota de Motos</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Registrar Moto</h2>
                <form action={createMoto} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" name="nombre" placeholder="Nombre / Modelo" required className="border p-2 rounded" />
                    <input type="text" name="patente" placeholder="Patente" required className="border p-2 rounded" />
                    <select name="usuario_id" className="border p-2 rounded">
                        <option value="">Asignar Chofer (Opcional)</option>
                        {potentialDrivers.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Registrar</button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <th className="px-6 py-3 border-b">ID</th>
                            <th className="px-6 py-3 border-b">Nombre</th>
                            <th className="px-6 py-3 border-b">Patente</th>
                            <th className="px-6 py-3 border-b">Estado</th>
                            <th className="px-6 py-3 border-b">Chofer Asignado</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {motos.map((moto) => (
                            <tr key={moto.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b">#{moto.id}</td>
                                <td className="px-6 py-4 border-b font-medium">{moto.nombre}</td>
                                <td className="px-6 py-4 border-b">{moto.patente}</td>
                                <td className="px-6 py-4 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${moto.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                                            moto.estado === 'en_viaje' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {moto.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    {users.find(u => u.id === moto.usuario_id)?.username || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

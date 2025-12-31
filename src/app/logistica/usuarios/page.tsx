import { getUsers, createUser, deleteUser } from '@/app/actions/logistica';

export default async function UsuariosPage() {
    const users = await getUsers();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestión de Usuarios</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Nuevo Usuario</h2>
                <form action={createUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" name="username" placeholder="Usuario" required className="border p-2 rounded" />
                    <input type="password" name="password" placeholder="Contraseña" required className="border p-2 rounded" />
                    <select name="nivel_permiso" className="border p-2 rounded" required>
                        <option value="1">Admin</option>
                        <option value="2">Chofer</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear</button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <th className="px-6 py-3 border-b">ID</th>
                            <th className="px-6 py-3 border-b">Usuario</th>
                            <th className="px-6 py-3 border-b">Rol</th>
                            <th className="px-6 py-3 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b">#{user.id}</td>
                                <td className="px-6 py-4 border-b font-medium">{user.username}</td>
                                <td className="px-6 py-4 border-b">
                                    {user.nivel_permiso === 1 ? 'Admin' : 'Chofer'}
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <form action={deleteUser.bind(null, user.id)}>
                                        <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-semibold">Eliminar</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

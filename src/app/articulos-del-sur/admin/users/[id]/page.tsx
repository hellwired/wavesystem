'use client';
import { use, useEffect, useState } from 'react';
import UserForm from '../../components/UserForm';
import { Loader2 } from 'lucide-react';

export default function EditUserPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/next/api/users/${params.id}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;
    if (!user) return <div>Usuario no encontrado</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8 max-w-4xl mx-auto">Editar Usuario</h1>
            <UserForm initialData={user} isEditing />
        </div>
    );
}

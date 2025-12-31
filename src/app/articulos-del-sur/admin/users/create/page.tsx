'use client';
import UserForm from '../../components/UserForm';

export default function CreateUserPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8 max-w-4xl mx-auto">Nuevo Usuario</h1>
            <UserForm />
        </div>
    );
}

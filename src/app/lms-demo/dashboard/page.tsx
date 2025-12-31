'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/lms-demo/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchCourses();
        }
    }, [user]);

    const fetchCourses = async () => {
        try {
            const res = await fetch(user?.role === 'student' ? '/next/lms-demo/api/enrollments' : '/next/lms-demo/api/courses', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
            });
            const data = await res.json();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        }
    };

    if (loading || !user) return <div className="p-8">Cargando...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar is now handled by Layout/Sidebar, but keeping this as a content wrapper if needed or removing if redundant. 
                Based on previous steps, Sidebar is the main nav. This top bar might be redundant or specific to dashboard. 
                Let's translate it just in case it's still visible. */}
            <nav className="bg-white shadow md:hidden">
                {/* Mobile header is in layout, this might be a duplicate or old code. 
                   The previous file content showed a full navbar. 
                   However, we implemented a Sidebar layout. 
                   Let's assume this local navbar is for user info/logout if not in sidebar.
                   But wait, Sidebar has logout. 
                   Let's translate what's here. */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">Panel de Control</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span>Bienvenido, {user.name} ({user.role === 'student' ? 'Estudiante' : user.role === 'instructor' ? 'Profesor' : 'Admin'})</span>
                            <button
                                onClick={() => { localStorage.removeItem('lms_token'); window.location.href = '/next/lms-demo/login'; }}
                                className="text-red-600 hover:text-red-800"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {user.role === 'student' ? 'Mis Materias' : 'Gestionar Materias'}
                        </h2>
                        {user.role !== 'student' && (
                            <button
                                onClick={() => router.push('/lms-demo/courses/create')}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Crear Materia
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course: any) => (
                            <div key={course.id || course.course_id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900">{course.title || course.course_title}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{course.description}</p>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => router.push(`/lms-demo/courses/${course.id || course.course_id}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Ver Materia
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && (
                            <p className="text-gray-500">No se encontraron materias.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

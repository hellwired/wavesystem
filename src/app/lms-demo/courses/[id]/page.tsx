'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, FileText, Link as LinkIcon, Plus, Trash2, File } from 'lucide-react';

export default function CoursePage() {
    const { user } = useAuth();
    const params = useParams();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    // Modal states
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

    // Form states
    const [moduleTitle, setModuleTitle] = useState('');
    const [resourceTitle, setResourceTitle] = useState('');
    const [resourceType, setResourceType] = useState('file');
    const [resourceUrl, setResourceUrl] = useState('');

    useEffect(() => {
        if (user && params.id) {
            fetchCourse();
        }
    }, [user, params.id]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/next/lms-demo/api/courses/${params.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
            });
            const data = await res.json();
            setCourse(data);
            // Expand all by default
            if (data.modules) {
                setExpandedModules(data.modules.map((m: any) => m.id));
            }
        } catch (error) {
            console.error('Failed to fetch course', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/next/lms-demo/api/modules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
                },
                body: JSON.stringify({
                    course_id: course.id,
                    title: moduleTitle,
                    order_index: course.modules ? course.modules.length : 0
                }),
            });
            if (res.ok) {
                setShowModuleModal(false);
                setModuleTitle('');
                fetchCourse();
            }
        } catch (error) {
            console.error('Failed to create module', error);
        }
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/next/lms-demo/api/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
                },
                body: JSON.stringify({
                    module_id: activeModuleId,
                    title: resourceTitle,
                    type: resourceType,
                    url: resourceUrl
                }),
            });
            if (res.ok) {
                setShowResourceModal(false);
                setResourceTitle('');
                setResourceUrl('');
                fetchCourse();
            }
        } catch (error) {
            console.error('Failed to create resource', error);
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="text-red-500" size={20} />;
            case 'doc': return <FileText className="text-blue-500" size={20} />;
            case 'link': return <LinkIcon className="text-gray-500" size={20} />;
            default: return <File className="text-gray-400" size={20} />;
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!course) return <div className="p-8">Course not found</div>;

    const isInstructor = user?.role === 'admin' || user?.role === 'instructor';

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">Materia</span>
                    <span className="hover:text-blue-600 cursor-pointer">Participantes</span>
                    <span className="hover:text-blue-600 cursor-pointer">Calificaciones</span>
                </div>
                <p className="mt-4 text-gray-600">{course.description}</p>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setExpandedModules(course.modules?.map((m: any) => m.id) || [])}
                    className="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1 rounded"
                >
                    Expandir todo
                </button>
                {isInstructor && (
                    <button
                        onClick={() => setShowModuleModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        <span>Nuevo Módulo</span>
                    </button>
                )}
            </div>

            {/* Modules Accordion */}
            <div className="space-y-4">
                {course.modules?.map((module: any) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div
                            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => toggleModule(module.id)}
                        >
                            <div className="flex items-center gap-3">
                                {expandedModules.includes(module.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                <h3 className="font-semibold text-gray-800">{module.title}</h3>
                            </div>
                        </div>

                        {expandedModules.includes(module.id) && (
                            <div className="p-4 border-t border-gray-200 bg-white">
                                {/* Resources List */}
                                <div className="space-y-3 pl-4">
                                    {module.resources?.map((resource: any) => (
                                        <div key={resource.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded group">
                                            <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                                                {getIconForType(resource.type)}
                                            </div>
                                            <div className="flex-1">
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-700 font-medium hover:text-blue-600 hover:underline block"
                                                >
                                                    {resource.title}
                                                </a>
                                                <span className="text-xs text-gray-400 uppercase">{resource.type}</span>
                                            </div>
                                            {isInstructor && (
                                                <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {(!module.resources || module.resources.length === 0) && (
                                        <p className="text-sm text-gray-400 italic pl-2">No hay recursos en este módulo.</p>
                                    )}

                                    {isInstructor && (
                                        <button
                                            onClick={() => { setActiveModuleId(module.id); setShowResourceModal(true); }}
                                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mt-4 border-t border-dashed border-gray-200 pt-3 w-full"
                                        >
                                            <Plus size={14} />
                                            <span>Añadir recurso o actividad</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {(!course.modules || course.modules.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No hay módulos creados aún.</p>
                    </div>
                )}
            </div>

            {/* Add Module Modal */}
            {showModuleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Nuevo Módulo</h3>
                        <form onSubmit={handleAddModule}>
                            <input
                                type="text"
                                placeholder="Nombre del módulo"
                                className="w-full p-2 border rounded mb-4"
                                value={moduleTitle}
                                onChange={e => setModuleTitle(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModuleModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Crear</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Resource Modal */}
            {showResourceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Nuevo Recurso</h3>
                        <form onSubmit={handleAddResource}>
                            <input
                                type="text"
                                placeholder="Título del recurso"
                                className="w-full p-2 border rounded mb-4"
                                value={resourceTitle}
                                onChange={e => setResourceTitle(e.target.value)}
                                required
                            />
                            <select
                                className="w-full p-2 border rounded mb-4"
                                value={resourceType}
                                onChange={e => setResourceType(e.target.value)}
                            >
                                <option value="file">Archivo (PDF/Doc)</option>
                                <option value="link">Enlace URL</option>
                                <option value="video">Video</option>
                            </select>
                            <input
                                type="text"
                                placeholder="URL o Ruta del archivo"
                                className="w-full p-2 border rounded mb-4"
                                value={resourceUrl}
                                onChange={e => setResourceUrl(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowResourceModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Añadir</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

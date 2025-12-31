'use client';

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar';

export default function LMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col md:flex-row">
                {/* Mobile Header */}
                <div className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
                    <span className="font-bold text-lg">LMS Demo</span>
                    <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-blue-700 rounded">
                        <Menu size={24} />
                    </button>
                </div>

                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 md:ml-64 transition-all duration-300">
                    {children}
                </div>
            </div>
        </AuthProvider>
    );
}

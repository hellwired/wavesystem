import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Venta POS | Wavesystem',
    description: 'Punto de Venta Profesional',
};

export default function POSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
            {/* Shell content could go here (Sidebar, Header) if shared */}
            <main className="h-screen w-full flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Smartphone, Tablet, Monitor, RotateCcw } from 'lucide-react';

type Device = 'mobile' | 'tablet' | 'desktop';

const DEVICES = {
    mobile: { width: '375px', height: '100%', label: 'iPhone', icon: Smartphone, scale: 1 },
    tablet: { width: '768px', height: '100%', label: 'iPad', icon: Tablet, scale: 1 },
    desktop: { width: '100%', height: '100%', label: 'Desktop', icon: Monitor, scale: 1 },
};

export default function MobileDemoPage() {
    const [currentDevice, setCurrentDevice] = useState<Device>('mobile');

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col font-sans overflow-hidden">
            {/* Header / Toolbar */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Link>
                    <div className="h-6 w-px bg-white/10"></div>
                    <h1 className="text-white font-semibold flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        Mobile First Simulator
                    </h1>
                </div>

                <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg border border-white/5">
                    {(Object.keys(DEVICES) as Device[]).map((device) => {
                        const Icon = DEVICES[device].icon;
                        const isActive = currentDevice === device;
                        return (
                            <button
                                key={device}
                                onClick={() => setCurrentDevice(device)}
                                className={`
                            flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all
                            ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                            >
                                <Icon className="w-4 h-4" />
                                {DEVICES[device].label}
                            </button>
                        );
                    })}
                </div>

                <div className="w-24"></div> {/* Spacer for balance */}
            </header>

            {/* Simulator Area */}
            <main className="flex-1 relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"></div>

                {/* Device Container */}
                <div
                    className={`z-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl bg-white overflow-hidden ${currentDevice === 'desktop' ? 'absolute inset-0 w-full h-full' : 'relative'
                        }`}
                    style={{
                        width: currentDevice === 'desktop' ? '100%' : DEVICES[currentDevice].width,
                        height: currentDevice === 'desktop' ? '100%' : '85vh',
                        borderRadius: currentDevice === 'desktop' ? '0' : '40px',
                        border: currentDevice === 'desktop' ? 'none' : '12px solid #1f2937'
                    }}
                >
                    {/* Notch mimic for mobile */}
                    {currentDevice === 'mobile' && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20"></div>
                    )}

                    <iframe
                        src="/next/mobile-demo/content"
                        className="w-full h-full bg-white"
                        title="Device Content"
                    />
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-8 left-8 p-4 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-white max-w-sm">
                    <h3 className="font-bold text-blue-400 mb-1">True Responsiveness</h3>
                    <p className="text-sm text-gray-300">
                        This simulator uses a real isolated viewport (iframe).
                        The content inside naturally adapts its layout using standard CSS Grid & Flexbox, just as it would on a physical device.
                    </p>
                </div>
            </main>
        </div>
    );
}

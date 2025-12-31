'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Wifi, Server, Zap, Activity, AlertTriangle } from 'lucide-react';

// Simplified Node Grid (Abstract Map Representation)
// Coordinates in % (top, left) approximately mapping to world regions
const NODES = [
    { id: 'us-east', name: 'N. Virginia', region: 'US East', top: 35, left: 28, status: 'active' },
    { id: 'us-west', name: 'California', region: 'US West', top: 38, left: 18, status: 'active' },
    { id: 'eu-london', name: 'London', region: 'Europe', top: 28, left: 48, status: 'active' },
    { id: 'eu-frankfurt', name: 'Frankfurt', region: 'Europe', top: 30, left: 51, status: 'active' },
    { id: 'ap-singapore', name: 'Singapore', region: 'Asia Pacific', top: 60, left: 78, status: 'active' },
    { id: 'ap-tokyo', name: 'Tokyo', region: 'Asia Pacific', top: 38, left: 85, status: 'active' },
    { id: 'sa-saopaulo', name: 'São Paulo', region: 'South America', top: 70, left: 35, status: 'active' },
    { id: 'au-sydney', name: 'Sydney', region: 'Australia', top: 80, left: 90, status: 'active' },
];

// User location fixed for demo simplicity (e.g., user in New York)
// Coordinates roughly near US East
const USER_LOC = { top: 34, left: 27 };

export default function GlobalDemoPage() {
    const [nodes, setNodes] = useState(NODES);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [metrics, setMetrics] = useState({ latency: 0, uptime: 100 });
    const [isSimulating, setIsSimulating] = useState(false);

    // Find nearest active node simplified distance logic
    useEffect(() => {
        let minDist = Infinity;
        let nearest: string | null = null;

        nodes.forEach(node => {
            if (node.status === 'down') return;

            const dx = node.left - USER_LOC.left;
            const dy = node.top - USER_LOC.top;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist) {
                minDist = dist;
                nearest = node.id;
            }
        });

        setActiveNodeId(nearest);

        // Simulate latency based on distance
        const baseLatency = nearest ? Math.max(5, Math.floor(minDist * 2.5)) : 0;
        setMetrics(prev => ({ ...prev, latency: baseLatency }));

    }, [nodes]);

    const toggleNodeStatus = (id: string) => {
        setIsSimulating(true);
        setNodes(prev => prev.map(n =>
            n.id === id ? { ...n, status: n.status === 'active' ? 'down' : 'active' } : n
        ));
        // Reset simulation flag after animation
        setTimeout(() => setIsSimulating(false), 500);
    };

    const activeNode = nodes.find(n => n.id === activeNodeId);

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-white overflow-hidden flex flex-col relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none"></div>

            {/* Header */}
            <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-gray-900/50 backdrop-blur-md">
                <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Earth
                </Link>
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="font-bold tracking-wide">GLOBAL EDGE NETWORK</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-gray-300">System Normal</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden">
                {/* Map Area */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Connection Line from User to Active Node */}
                    {activeNode && (
                        <svg className="absolute inset-0 w-full h-full z-10">
                            <line
                                x1={`${USER_LOC.left}%`}
                                y1={`${USER_LOC.top}%`}
                                x2={`${activeNode.left}%`}
                                y2={`${activeNode.top}%`}
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                className="animate-pulse opacity-50 transition-all duration-300"
                            />
                        </svg>
                    )}
                </div>

                {/* Nodes Layer */}
                <div className="absolute inset-0 z-20">
                    {/* User Dot */}
                    <div
                        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] z-30 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ top: `${USER_LOC.top}%`, left: `${USER_LOC.left}%` }}
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-white text-black px-1.5 rounded font-bold">YOU</div>
                    </div>

                    {/* Server Nodes */}
                    {nodes.map(node => (
                        <button
                            key={node.id}
                            onClick={() => toggleNodeStatus(node.id)}
                            className={`
                        absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                        flex items-center justify-center cursor-pointer hover:scale-125
                        ${node.status === 'active' ? 'bg-blue-500 shadow-[0_0_20px_blue]' : 'bg-red-600 shadow-[0_0_20px_red]'}
                        ${activeNodeId === node.id ? 'ring-4 ring-blue-400/30' : ''}
                    `}
                            style={{ top: `${node.top}%`, left: `${node.left}%` }}
                        >
                            <Server className="w-3 h-3 text-white" />

                            {/* Tooltip */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 border border-white/10 px-2 py-1 rounded text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-40">
                                {node.name}
                            </div>
                        </button>
                    ))}
                </div>

                {/* HUD / Controls */}
                <div className="absolute bottom-8 left-8 z-30 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-sm w-full">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Network Diagnostics
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-400 uppercase">Current Latency</p>
                                <p className={`text-2xl font-mono font-bold ${activeNode ? 'text-green-400' : 'text-red-500'}`}>
                                    {activeNode ? `${metrics.latency}ms` : 'FAIL'}
                                </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-400 uppercase">Connected To</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {activeNode ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-semibold truncate">{activeNode.name}</span>
                                        </>
                                    ) : (
                                        <span className="text-red-500 font-bold text-sm">NO CONNECTION</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm leading-relaxed text-blue-200">
                            <p>
                                <strong className="text-blue-100">Click any node to kill it.</strong>
                                <br />
                                Watch how the system intelligently reroutes your connection ("You") to the next nearest available edge server instantly.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

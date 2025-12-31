'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Activity, MousePointer, Zap, Play, Square } from 'lucide-react';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('../../components/charts/AnalyticsChart'), {
    loading: () => <div className="w-full h-full flex items-center justify-center text-gray-400">Loading chart...</div>,
    ssr: false
});

// Backend URL (proxied via Apache to port 3001)
// Note: In local dev it's localhost:3001, in prod it's https://wavesystem.online/atomic-demo/
// Since we are under /next basePath, and socket.io needs to connect to the backend.
// We configure Socket.io to connect to the root domain but path /atomic-demo/socket.io not strictly needed if we use the proxy correctly.
// The backend is at https://wavesystem.online/atomic-demo/
// But Socket.io client usually connects to the host.
// We might need to specify the path if we route traffic via /atomic-demo/ 
// Actually, for simplicity in this demo environment, let's assume the client connects to the same origin 
// but we might need a specific path config if Apache proxies /atomic-demo to port 3001.
// Let's try connecting to the path /atomic-demo/socket.io (Apache rewrite rule might be needed or just /socket.io if we expose it).
// Given Apache config: ProxyPass /atomic-demo/ http://localhost:3001/
// So requests to https://wavesystem.online/atomic-demo/socket.io/... will go to http://localhost:3001/socket.io/...
// This should work.

const SOCKET_URL = '/atomic-demo'; // Namespace or Path prefix? Socket.io client uses path option.

export default function AnalyticsDemoPage() {
    const [socket, setSocket] = useState<any>(null);
    const [activeUsers, setActiveUsers] = useState(0);
    const [latencyData, setLatencyData] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        // Initialize Socket Connection
        // path: '/atomic-demo/socket.io' ensures it goes through the Apache proxy to the node backend
        const newSocket = io({
            path: '/atomic-demo/socket.io',
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('Connected to Analytics Stream');
        });

        newSocket.on('analytics_update', (data: any) => {
            setActiveUsers(data.activeUsers);

            // Update Latency Chart
            setLatencyData(prev => {
                const newData = [...prev, { time: new Date().toLocaleTimeString(), latency: data.latency }];
                return newData.slice(-20); // Keep last 20 points
            });

            // Update Event Feed
            if (data.event) {
                setEvents(prev => [data.event, ...prev].slice(0, 10)); // Keep last 10 events
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const toggleSimulation = async () => {
        if (!socket) return;

        setIsSimulating(!isSimulating);
        const endpoint = isSimulating ? 'stop' : 'start';

        try {
            await fetch(`/atomic-demo/simulation/${endpoint}`, { method: 'POST' });
        } catch (err) {
            console.error("Failed to toggle simulation", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Link>
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h1 className="font-bold text-gray-900">Real-time Analytics Dashboard</h1>
                </div>
                <div className="w-20"></div>
            </header>

            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* KPI Card (Giant) */}
                <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div>
                        <p className="text-gray-600 font-medium mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Live Active Users
                        </p>
                        <h2 className="text-7xl font-bold tracking-tighter text-blue-600 tabular-nums">
                            {activeUsers}
                        </h2>
                    </div>
                    <div className="mt-8 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${activeUsers > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-400">Updating in real-time via WebSockets</span>
                    </div>

                    {/* Simulation Control */}
                    <button
                        onClick={toggleSimulation}
                        className={`
                    absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all
                    ${isSimulating ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'}
                `}
                        title={isSimulating ? "Stop Simulation" : "Start Traffic Spike"}
                    >
                        {isSimulating ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>
                </div>

                {/* Charts Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Latency Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                System Latency (ms)
                            </h3>
                            <span className="text-xs text-gray-400">Last 20 ticks</span>
                        </div>
                        <AnalyticsChart data={latencyData} />
                    </div>

                    {/* Event Feed */}
                    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-800 h-[250px] overflow-hidden flex flex-col">
                        <h3 className="font-bold text-gray-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <MousePointer className="w-4 h-4" />
                            Live Event Feed
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                            {events.length === 0 ? (
                                <p className="text-gray-600 text-sm italic">Waiting for events...</p>
                            ) : (
                                events.map((evt, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-sm animate-in slide-in-from-right-2 fade-in duration-300">
                                        <span className="text-gray-600 text-xs font-mono">{evt.timestamp.split('T')[1].split('.')[0]}</span>
                                        <div>
                                            <span className={`font-bold mr-2 ${evt.type === 'page_view' ? 'text-blue-400' :
                                                evt.type === 'click' ? 'text-green-400' :
                                                    evt.type === 'api_call' ? 'text-purple-400' : 'text-yellow-400'
                                                }`}>
                                                [{evt.type.toUpperCase()}]
                                            </span>
                                            <span className="text-gray-300">{evt.detail}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}

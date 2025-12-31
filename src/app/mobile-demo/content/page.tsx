'use client';

import React from 'react';
import { Home, PieChart, Bell, Search, Menu, CreditCard, TrendingUp, Users } from 'lucide-react';

export default function MobileDemoContent() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
            {/* Mobile Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                    <span className="font-semibold text-lg">WaveDash</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"><Search className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"><Bell className="w-5 h-5" /></button>
                </div>
            </header>

            <main className="p-4 space-y-6">
                {/* Welcome Section */}
                <section>
                    <h1 className="text-2xl font-bold">Hello, Alex 👋</h1>
                    <p className="text-gray-600">Here is your daily activity.</p>
                </section>

                {/* Stats Grid - Responsive Magic Happen Here */}
                {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CreditCard className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-xl font-bold">$45,231.89</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-xl font-bold">2,450</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-700 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-600">Growth</p>
                            <p className="text-xl font-bold text-green-700">+12.5%</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><PieChart className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-600">Conversion</p>
                            <p className="text-xl font-bold">3.2%</p>
                        </div>
                    </div>
                </section>

                {/* Main Chart / Content Area */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart Area - Takes 2 cols on Desktop */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 md:h-80 flex flex-col justify-center items-center text-gray-400 bg-gradient-to-br from-gray-50 to-white">
                        <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
                        <span>Interactive Chart Component</span>
                        <span className="text-xs opacity-50">(Auto-resizes)</span>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4">Recent Sales</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                                        <div>
                                            <p className="font-medium text-sm">Product {i}</p>
                                            <p className="text-xs text-gray-600">2 min ago</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm">+${(i * 120).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Mobile Nav - Visible on Mobile Only (Hidden on LG) */}
            <nav className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center lg:hidden">
                <Home className="w-6 h-6 text-blue-400" />
                <TrendingUp className="w-6 h-6 text-gray-400" />
                <div className="w-12 h-12 bg-blue-600 rounded-full -mt-10 flex items-center justify-center shadow-lg border-4 border-gray-50">
                    <PieChart className="w-6 h-6" />
                </div>
                <Users className="w-6 h-6 text-gray-400" />
                <Menu className="w-6 h-6 text-gray-400" />
            </nav>
        </div>
    );
}

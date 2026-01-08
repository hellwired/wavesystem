'use client';

import React, { useState, useRef, useEffect } from 'react';

interface BarcodeScannerProps {
    onScan: (code: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
    const [code, setCode] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            onScan(code.trim());
            setCode('');
            // Keep focus for continuous scanning
            inputRef.current?.focus();
        }
    };

    // Auto-focus on mount (optional, maybe annoying on mobile if keyboard pops up)
    // useEffect(() => {
    //     inputRef.current?.focus();
    // }, []);

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 notranslate">qr_code_scanner</span>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white dark:bg-[#1a2230]"
                    placeholder="Escanear SKU o Ubicación..."
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-blue-600 font-bold hover:text-blue-700"
                >
                    IR
                </button>
            </div>
        </form>
    );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Quick Client-side check (Middleware does the heavy lifting via cookies)
        // We can double check via a fast API call or just trust middleware + handling 401s in API calls
        // For better UX during dev without middleware fully active, we can check cookie existence via document.cookie?
        // Or simply render children.
        setAuthorized(true);
    }, []);

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

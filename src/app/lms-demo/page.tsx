'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LMSLandingPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('lms_token');
        if (token) {
            router.push('/lms-demo/dashboard');
        } else {
            router.push('/lms-demo/login');
        }
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Redirecting...</p>
        </div>
    );
}

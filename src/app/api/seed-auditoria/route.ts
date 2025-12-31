import { NextResponse } from 'next/server';
import { createInitialUser } from '@/app/actions/auth_auditoria';

export async function GET() {
    try {
        await createInitialUser();
        return NextResponse.json({ message: 'User seeded successfully' });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

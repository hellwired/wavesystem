import { NextResponse } from 'next/server';
import { createInitialUser } from '@/app/actions/auth_auditoria';

export async function GET() {
    try {
        await createInitialUser();
        return NextResponse.json({ message: 'Initial user created successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user', details: String(error) }, { status: 500 });
    }
}

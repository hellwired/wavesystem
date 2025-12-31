import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), 'public/image/products');
        const files = await readdir(uploadDir);
        return NextResponse.json({
            cwd: process.cwd(),
            path: uploadDir,
            files
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}.webp`; // Always saving as webp since frontend converts it

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'public/image/products');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Ignore if directory exists
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `image/products/${filename}`;

        return NextResponse.json({
            message: 'File uploaded successfully',
            url: publicUrl
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
    }
}

'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file provided');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Usamos crypto nativo en lugar de uuid para evitar dependencias extra
    const uniqueSuffix = crypto.randomUUID();
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Asegurar directorio de subida
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'audit-evidence');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (error) {
        console.error('Error creating upload directory:', error);
    }

    // Guardar archivo
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Retornar URL relativa
    return `/uploads/audit-evidence/${filename}`;
}

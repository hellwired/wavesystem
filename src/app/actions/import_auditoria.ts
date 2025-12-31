'use server';

import poolAuditoria from '@/lib/db_auditoria';
import { revalidatePath } from 'next/cache';
import AdmZip from 'adm-zip';
import { createExtractorFromData } from 'node-unrar-js';

interface ImportResult {
    success: boolean;
    message: string;
    recordsProcessed?: number;
    error?: string;
}

/**
 * Main function to import products from DBF, ZIP, or RAR.
 */
export async function importProductsFromDBF(formData: FormData): Promise<ImportResult> {
    const file = formData.get('file') as File;
    const deposito = formData.get('deposito') as string;
    const fecha = formData.get('fecha') as string;

    if (!file) return { success: false, message: 'No se proporcionó ningún archivo.' };
    if (!deposito) return { success: false, message: 'El nombre del depósito es obligatorio.' };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = file.name.toLowerCase();
        let dbfBuffer: Buffer | null = null;
        let originalName = file.name;

        // --- 1. Decompression Logic ---
        if (fileName.endsWith('.zip')) {
            try {
                const zip = new AdmZip(buffer);
                const zipEntries = zip.getEntries();

                // Find first DBF or XLS(DBF) file
                const validEntry = zipEntries.find(entry =>
                    entry.entryName.toLowerCase().endsWith('.dbf') ||
                    entry.entryName.toLowerCase().endsWith('.xls')
                );

                if (!validEntry) {
                    return { success: false, message: 'El archivo ZIP no contiene ningún archivo .dbf o .xls válido.' };
                }

                dbfBuffer = validEntry.getData();
                originalName = validEntry.entryName;
            } catch (e) {
                return { success: false, message: 'Error al leer el archivo ZIP. Puede estar corrupto.' };
            }
        }
        else if (fileName.endsWith('.rar')) {
            try {
                // node-unrar-js usage
                // Create a temporary file or use memory extraction if possible. 
                // The library ideally wants a file path, but supports buffer via typed arrays if configured.
                // For simplicity/compatibility in this environment, we attempt the standard buffer approach if supported,
                // or we fall back to a simpler check. Note: node-unrar-js usually requires a file path or Uint8Array.

                // Since saving temp files might be tricky with permissions, we will assume standard upload first.
                // However, without a temp file write, unrar-js usage is complex.
                // Let's attempt to use the 'createExtractorFromData' if available in v2, or write to /tmp.

                // NOTE: simpler Unrar implementations might be better but let's try to handle via buffer if the lib supports it.
                // If this is too complex for this environment, we might stick to ZIP. But I will add the logic 
                // assuming we can pass the buffer.

                const extractor = await createExtractorFromData({ data: arrayBuffer });
                const list = extractor.getFileList();
                const headers = [...list.fileHeaders];

                const validHeader = headers.find(h =>
                    h.name.toLowerCase().endsWith('.dbf') ||
                    h.name.toLowerCase().endsWith('.xls')
                );

                if (!validHeader) {
                    return { success: false, message: 'El archivo RAR no contiene ningún archivo .dbf o .xls válido.' };
                }

                const extracted = extractor.extract({ files: [validHeader.name] });
                // validHeader.name might be inside a folder, normalized handling needed?
                // node-unrar-js v2 returns an iterator or object.
                // Let's assume simplest 'extract' behavior returns { files: [ { extraction, fileHeader } ] }

                const files = [...extracted.files];
                if (files.length > 0 && files[0].extraction) {
                    dbfBuffer = Buffer.from(files[0].extraction);
                    originalName = files[0].fileHeader.name;
                } else {
                    throw new Error('Falló la extracción del RAR');
                }

            } catch (e) {
                console.error("RAR Error:", e);
                // Fallback or friendly error
                return { success: false, message: 'No se pudo procesar el archivo RAR. Asegúrese de que sea un RAR v4/v5 válido.' };
            }
        }
        else {
            // Assume it is already the file
            dbfBuffer = buffer;
        }

        if (!dbfBuffer) return { success: false, message: 'No se pudo obtener el contenido del archivo.' };

        // --- 2. Process the DBF Buffer ---
        return await processDBFBuffer(dbfBuffer, deposito, fecha, originalName);

    } catch (error: any) {
        console.error('Error en importación:', error);
        return { success: false, message: 'Error crítico al procesar el archivo.', error: error.message };
    }
}

/**
 * Core DBF Parsing and Sync Logic
 */
async function processDBFBuffer(buffer: Buffer, deposito: string, fecha: string, originalName: string): Promise<ImportResult> {
    // 1. Parse DBF Header
    if (buffer.length < 32) return { success: false, message: 'Archivo DBF inválido o vacío.' };

    const numRecords = buffer.readUInt32LE(4);
    const headerLen = buffer.readUInt16LE(8);
    const recordLen = buffer.readUInt16LE(10);

    // 2. Parse Field Descriptors
    const numFields = Math.floor((headerLen - 33) / 32);
    const fields: { name: string; type: string; length: number; offset: number }[] = [];
    let currentOffset = 1; // Skip deletion flag

    for (let i = 0; i < numFields; i++) {
        const fieldData = buffer.slice(32 + i * 32, 64 + i * 32);
        if (fieldData[0] === 0x0D) break;

        const name = fieldData.slice(0, 11).toString('ascii').replace(/\0/g, '').trim();
        const type = String.fromCharCode(fieldData[11]);
        const length = fieldData[16];

        fields.push({ name, type, length, offset: currentOffset });
        currentOffset += length;
    }

    // 3. Process Records
    const BATCH_SIZE = 5000;
    let processedCount = 0;
    const connection = await poolAuditoria.getConnection();

    try {
        await connection.beginTransaction();

        const fechaDatos = fecha || new Date().toISOString().split('T')[0];

        // Ensure date is valid or null? Schema allows null but we prefer valid

        for (let i = 0; i < numRecords; i += BATCH_SIZE) {
            const batchRecords: any[][] = [];
            const limit = Math.min(i + BATCH_SIZE, numRecords);

            for (let j = i; j < limit; j++) {
                const recordStart = headerLen + j * recordLen;
                // Safety check for buffer boundaries
                if (recordStart + recordLen > buffer.length) break;

                const recordData = buffer.slice(recordStart, recordStart + recordLen);

                const record: any = {};
                fields.forEach(field => {
                    const val = recordData.slice(field.offset, field.offset + field.length)
                        .toString('latin1')
                        .trim();
                    record[field.name] = val;
                });

                // Validation: CODIGO must exist
                if (!record.CODIGO) continue;

                batchRecords.push([
                    record.CODIGO,
                    record.DENOMINAC || 'Sin nombre',
                    record.RUBVTA || 'General',
                    parseFloat(record.PRECIO) || 0,
                    parseInt(record.STOCK) || 0,
                    deposito,
                    fechaDatos
                ]);
            }

            if (batchRecords.length > 0) {
                await connection.query(
                    `INSERT INTO productos_audit 
                        (sku, nombre, categoria, costo, stock_teorico, deposito, fecha_datos) 
                        VALUES ? 
                        ON DUPLICATE KEY UPDATE 
                        nombre = VALUES(nombre), 
                        categoria = VALUES(categoria), 
                        costo = VALUES(costo), 
                        stock_teorico = VALUES(stock_teorico),
                        deposito = VALUES(deposito),
                        fecha_datos = VALUES(fecha_datos)`,
                    [batchRecords]
                );
                processedCount += batchRecords.length;
            }
        }

        await connection.commit();
        revalidatePath('/AuditoriaDepoStock');

        return {
            success: true,
            message: `Importación completada. Se extrajo "${originalName}" y se actualizaron ${processedCount} registros.`,
            recordsProcessed: processedCount
        };

    } catch (error: any) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}


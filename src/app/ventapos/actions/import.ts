'use server';

import pool from '@/lib/ventapos-db';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';


export async function processSupplierFile(formData: FormData) {
    // Dynamic import to avoid build/runtime issues with CommonJS module in Server Actions
    // const { DBFFile } = await import('dbffile');

    const file = formData.get('file') as File;

    if (!file) {
        return { success: false, message: 'No se ha proporcionado ningún archivo.' };
    }

    if (!file.name.toLowerCase().endsWith('.xls') && !file.name.toLowerCase().endsWith('.dbf')) {
        return { success: false, message: 'Formato inválido. Se espera .xls (DBF) o .dbf' };
    }

    /*
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save properly to a temp directory
    const tempDir = process.env.TEMP || '/tmp';
    const tempFilePath = join(tempDir, `upload_${Date.now()}_${file.name}`);
    
    try {
        await writeFile(tempFilePath, buffer);
    
        // Process DBF
        const dbf = await DBFFile.open(tempFilePath);
    
        let processed = 0;
        let matched = 0;
        let updated = 0;
        let errors = 0;
        const batchSize = 1000;
    
        // Match Stats
        let matchByBarcode = 0;
        let matchByCode_Codbar = 0;
        let matchByCode_Codigo = 0;
    
        let records = await dbf.readRecords(batchSize);
    
        while (records.length > 0) {
            for (const record of records) {
                const codbar = record.CODBAR ? record.CODBAR.toString().trim() : null;
                const codigo = record.CODIGO ? record.CODIGO.toString().trim() : null;
                const newPrice = record.PRECIO || 0;
                const newCost = record.COSTO || 0;
    
                if (!codbar && !codigo) continue;
    
                try {
                    let product = null;
                    let matchType = '';
    
                    // Strategy 1: CODBAR -> barcode
                    if (codbar) {
                        const [rows] = await pool.query(
                            'SELECT id, salePrice, costPrice, description, code, barcode FROM Products WHERE barcode = ?',
                            [codbar]
                        );
                        const results = rows as any[];
                        if (results.length > 0) {
                            product = results[0];
                            matchType = 'BARCODE';
                            matchByBarcode++;
                        }
                    }
    
                    // Strategy 2: CODBAR -> code
                    if (!product && codbar) {
                        const [rows] = await pool.query(
                            'SELECT id, salePrice, costPrice, description, code, barcode FROM Products WHERE code = ?',
                            [codbar]
                        );
                        const results = rows as any[];
                        if (results.length > 0) {
                            product = results[0];
                            matchType = 'CODE_FROM_CODBAR';
                            matchByCode_Codbar++;
                        }
                    }
    
                    // Strategy 3: CODIGO -> code
                    if (!product && codigo) {
                        const [rows] = await pool.query(
                            'SELECT id, salePrice, costPrice, description, code, barcode FROM Products WHERE code = ?',
                            [codigo]
                        );
                        const results = rows as any[];
                        if (results.length > 0) {
                            product = results[0];
                            matchType = 'CODE_FROM_CODIGO';
                            matchByCode_Codigo++;
                        }
                    }
    
                    if (product) {
                        matched++;
    
                        // Check for price difference (tolerance 0.01)
                        const priceChanged = Math.abs(Number(product.salePrice) - Number(newPrice)) > 0.01;
                        const costChanged = Number(newCost) > 0 && Math.abs(Number(product.costPrice) - Number(newCost)) > 0.01;
    
                        if (priceChanged || costChanged) {
                            const updates = [];
                            const values = [];
    
                            if (priceChanged) {
                                updates.push('salePrice = ?');
                                values.push(newPrice);
                            }
                            if (costChanged) {
                                updates.push('costPrice = ?');
                                values.push(newCost);
                            }
    
                            values.push(product.id);
    
                            await pool.query(
                                `UPDATE Products SET ${updates.join(', ')} WHERE id = ?`,
                                values
                            );
                            updated++;
                        }
                    }
                } catch (err) {
                    console.error('Record processing error', err);
                    errors++;
                }
            }
    
            processed += records.length;
            records = await dbf.readRecords(batchSize);
        }
    
        return {
            success: true,
            message: 'Archivo procesado correctamente',
            stats: {
                processed,
                matched,
                updated,
                errors,
                details: {
                    byBarcode: matchByBarcode,
                    byCodeCodbar: matchByCode_Codbar,
                    byCodeCodigo: matchByCode_Codigo
                }
            }
        };
    */
    /*
    } catch (error: any) {
        console.error('Import error:', error);
        return { success: false, message: `Error al procesar archivo: ${error.message}` };
    } finally {
        try {
            await unlink(tempFilePath);
        } catch (e) {
            console.error('Failed to clean up temp file:', e);
        }
    }
    */
}

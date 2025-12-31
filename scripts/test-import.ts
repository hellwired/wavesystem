import fs from 'fs';
import path from 'path';
import poolAuditoria from '../src/lib/db_auditoria';

async function testImport() {
    const filePath = '/home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/AuditoriaDepoStock/tmp/aspre.xls';
    console.log(`Leyendo archivo: ${filePath}`);

    const buffer = fs.readFileSync(filePath);

    // DBF Header
    const numRecords = buffer.readUInt32LE(4);
    const headerLen = buffer.readUInt16LE(8);
    const recordLen = buffer.readUInt16LE(10);

    console.log(`Registros: ${numRecords}`);
    console.log(`Largo Cabecera: ${headerLen}`);
    console.log(`Largo Registro: ${recordLen}`);

    // Field Descriptors
    const numFields = Math.floor((headerLen - 33) / 32);
    const fields: { name: string; type: string; length: number; offset: number }[] = [];
    let currentOffset = 1;

    for (let i = 0; i < numFields; i++) {
        const fieldData = buffer.slice(32 + i * 32, 64 + i * 32);
        if (fieldData[0] === 0x0D) break;

        const name = fieldData.slice(0, 11).toString('ascii').replace(/\0/g, '').trim();
        const type = String.fromCharCode(fieldData[11]);
        const length = fieldData[16];

        fields.push({ name, type, length, offset: currentOffset });
        currentOffset += length;
    }

    console.log(`Campos detectados: ${fields.map(f => f.name).join(', ')}`);

    const BATCH_SIZE = 5000;
    let processedCount = 0;
    const connection = await poolAuditoria.getConnection();

    try {
        await connection.beginTransaction();
        console.log('Iniciando transacción...');

        // Solo probaremos los primeros 10000 para no tardar demasiado en el test
        const testLimit = Math.min(numRecords, 10000);

        for (let i = 0; i < testLimit; i += BATCH_SIZE) {
            const batchRecords: any[][] = [];
            const limit = Math.min(i + BATCH_SIZE, testLimit);

            for (let j = i; j < limit; j++) {
                const recordStart = headerLen + j * recordLen;
                const recordData = buffer.slice(recordStart, recordStart + recordLen);

                const record: any = {};
                fields.forEach(field => {
                    const val = recordData.slice(field.offset, field.offset + field.length)
                        .toString('latin1')
                        .trim();
                    record[field.name] = val;
                });

                batchRecords.push([
                    record.CODIGO,
                    record.DENOMINAC || 'Sin nombre',
                    record.RUBVTA || 'General',
                    parseFloat(record.PRECIO) || 0,
                    parseInt(record.STOCK) || 0
                ]);
            }

            if (batchRecords.length > 0) {
                await connection.query(
                    `INSERT INTO productos_audit (sku, nombre, categoria, costo, stock_teorico) 
                     VALUES ? 
                     ON DUPLICATE KEY UPDATE 
                     nombre = VALUES(nombre), 
                     categoria = VALUES(categoria), 
                     costo = VALUES(costo), 
                     stock_teorico = VALUES(stock_teorico)`,
                    [batchRecords]
                );
                processedCount += batchRecords.length;
                console.log(`Procesados: ${processedCount}`);
            }
        }

        await connection.commit();
        console.log('¡Importación de prueba exitosa!');

    } catch (error) {
        await connection.rollback();
        console.error('Error en test:', error);
    } finally {
        connection.release();
        process.exit();
    }
}

testImport();

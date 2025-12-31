console.log('1. Cargando fs...');
const fs = require('fs');
console.log('2. Cargando path...');
const path = require('path');
console.log('3. Cargando mysql2...');
const mysql = require('mysql2/promise');
console.log('4. Cargando dotenv...');
require('dotenv').config({ path: '.env.local' });

async function testImport() {
    console.log('5. Entrando a testImport()...');
    const filePath = path.join(process.cwd(), 'src/app/AuditoriaDepoStock/tmp/aspre.xls');
    console.log(`6. Buscando archivo en: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error('ERROR: El archivo no existe.');
        return;
    }

    try {
        console.log('7. Leyendo archivo...');
        const buffer = fs.readFileSync(filePath);
        console.log(`8. Archivo leído. Tamaño: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

        const numRecords = buffer.readUInt32LE(4);
        const headerLen = buffer.readUInt16LE(8);
        const recordLen = buffer.readUInt16LE(10);

        console.log(`9. Registros: ${numRecords}, Cabecera: ${headerLen}, Registro: ${recordLen}`);

        const numFields = Math.floor((headerLen - 33) / 32);
        const fields = [];
        let currentOffset = 1;

        for (let i = 0; i < numFields; i++) {
            const fieldData = buffer.slice(32 + i * 32, 64 + i * 32);
            if (fieldData[0] === 0x0D) break;

            const name = fieldData.slice(0, 11).toString('ascii').replace(/\0/g, '').trim();
            const length = fieldData[16];

            fields.push({ name, length, offset: currentOffset });
            currentOffset += length;
        }

        console.log(`10. Campos detectados: ${fields.map(f => f.name).join(', ')}`);

        console.log('11. Conectando a la base de datos...');
        console.log(`Host: ${process.env.DB_HOST_REMOTE}, User: ${process.env.DB_USER_REMOTE}, DB: ${process.env.DB_NAME_AUDITORIA}`);

        const pool = mysql.createPool({
            host: process.env.DB_HOST_REMOTE,
            port: Number(process.env.DB_PORT_REMOTE) || 3306,
            user: process.env.DB_USER_REMOTE,
            password: process.env.DB_PASSWORD_REMOTE,
            database: process.env.DB_NAME_AUDITORIA,
            connectTimeout: 5000,
        });

        const connection = await pool.getConnection();
        console.log('12. Conexión establecida.');

        await connection.beginTransaction();
        console.log('13. Iniciando transacción...');

        const BATCH_SIZE = 1000;
        const testLimit = Math.min(numRecords, 2000);
        let processedCount = 0;

        for (let i = 0; i < testLimit; i += BATCH_SIZE) {
            const batchRecords = [];
            const limit = Math.min(i + BATCH_SIZE, testLimit);

            for (let j = i; j < limit; j++) {
                const recordStart = headerLen + j * recordLen;
                const recordData = buffer.slice(recordStart, recordStart + recordLen);

                const record = {};
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
                console.log(`14. Procesados: ${processedCount}`);
            }
        }

        await connection.commit();
        console.log('15. ¡Importación de prueba exitosa!');
        connection.release();
        await pool.end();

    } catch (error) {
        console.error('ERROR durante el test:', error);
    } finally {
        process.exit();
    }
}

testImport();

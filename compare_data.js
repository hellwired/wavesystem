const { DBFFile } = require('dbffile');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const DBF_PATH = path.join(__dirname, 'src/app/ventapos/tmp/aspre.xls');

async function compare() {
    console.log('--- Deep Data Analysis ---');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST_LOCAL,
        user: process.env.DB_USER_LOCAL,
        password: process.env.DB_PASSWORD_LOCAL,
        database: 'ventapos',
    });

    try {
        // 1. Analyze DB Barcodes
        const [cnt] = await connection.query('SELECT COUNT(*) as total, COUNT(barcode) as hasBarcode FROM Products');
        console.log(`\nDB Stats:`);
        console.log(`- Total Products: ${cnt[0].total}`);
        console.log(`- With Barcode: ${cnt[0].hasBarcode}`);

        // 2. See products WITH barcodes (if any)
        if (cnt[0].hasBarcode > 0) {
            const [rows] = await connection.query('SELECT code, barcode, description FROM Products WHERE barcode IS NOT NULL LIMIT 3');
            console.log('\nSample Products WITH Barcode:');
            console.table(rows);
        }

        // 3. Read DBF Sample again
        const dbf = await DBFFile.open(DBF_PATH);
        const dbfRecords = await dbf.readRecords(5);
        const dbfSample = dbfRecords[0];

        console.log('\nDBF Sample Record:');
        console.log(`CODIGO: ${dbfSample.CODIGO}`);
        console.log(`CODBAR: ${dbfSample.CODBAR}`);

        // 4. Cross-Reference Check
        // Does DBF.CODIGO match DB.code?
        // Does DBF.CODBAR match DB.code?
        console.log('\nCross-Check Probe:');

        // Check by Barcode
        if (dbfSample.CODBAR) {
            const [matchBarcode] = await connection.query('SELECT * FROM Products WHERE barcode = ? OR code = ?', [dbfSample.CODBAR, dbfSample.CODBAR]);
            console.log(`Match by CODBAR '${dbfSample.CODBAR}'? ${matchBarcode.length > 0 ? 'YES' : 'NO'}`);
        }

        // Check by Code
        const dbfCode = String(dbfSample.CODIGO).trim();
        const [matchCode] = await connection.query('SELECT * FROM Products WHERE code = ?', [dbfCode]);
        console.log(`Match by CODIGO '${dbfCode}'? ${matchCode.length > 0 ? 'YES' : 'NO'}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

compare();


const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Admin001',
    database: 'auditoriadepstock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkSchema() {
    try {
        const [rows] = await pool.query('DESCRIBE productos_audit');
        const barcodeField = rows.find(row => row.Field === 'barcode');
        if (barcodeField) {
            console.log('Barcode column exists:', barcodeField);
        } else {
            console.error('Barcode column MISSING');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error checking schema:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkSchema();

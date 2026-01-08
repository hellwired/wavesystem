const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

async function verifySchema() {
    console.log('Verifying schema...');
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST_REMOTE,
            port: Number(process.env.DB_PORT_REMOTE) || 3306,
            user: process.env.DB_USER_REMOTE,
            password: process.env.DB_PASSWORD_REMOTE,
            database: process.env.DB_NAME_AUDITORIA
        });

        const [rows] = await connection.query("SHOW COLUMNS FROM productos_audit LIKE 'barcode'");

        if (rows.length > 0) {
            console.log('✅ SUCCESS: Column `barcode` exists in `productos_audit`.');
            console.log(rows[0]);
        } else {
            console.error('❌ FAILURE: Column `barcode` MISSING in `productos_audit`. Migration required.');
        }

    } catch (error) {
        console.error('Error verifying schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

verifySchema();

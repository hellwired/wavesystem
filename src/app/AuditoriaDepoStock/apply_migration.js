const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const config = {
        host: process.env.DB_HOST_REMOTE,
        port: Number(process.env.DB_PORT_REMOTE) || 3306,
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
        multipleStatements: true
    };

    console.log('Connecting to database:', config.database, 'at', config.host);

    let connection;
    try {
        connection = await mysql.createConnection(config);

        const sqlPath = path.join(__dirname, 'migration_add_barcode.sql');
        console.log('Reading migration file form:', sqlPath);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing migration SQL...');
        await connection.query(sql);
        console.log('Migration completed successfully.');

    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        if (connection) await connection.end();
    }
}

run();

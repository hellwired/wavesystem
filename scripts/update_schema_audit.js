
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function updateSchema() {
    const config = {
        host: process.env.DB_HOST_REMOTE,
        port: parseInt(process.env.DB_PORT_REMOTE || '3306'),
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
    };

    console.log('Connecting to database...');
    const connection = await mysql.createConnection(config);

    try {
        console.log('Updating `conteos` table...');
        // Check if columns exist before adding to avoid errors if run multiple times
        const [columns] = await connection.query(`SHOW COLUMNS FROM conteos LIKE 'notas'`);
        if (columns.length === 0) {
            await connection.query(`ALTER TABLE conteos ADD COLUMN notas TEXT DEFAULT NULL`);
            console.log('Added `notas` column.');
        } else {
            console.log('`notas` column already exists.');
        }

        const [columnsEvidencia] = await connection.query(`SHOW COLUMNS FROM conteos LIKE 'evidencia_url'`);
        if (columnsEvidencia.length === 0) {
            await connection.query(`ALTER TABLE conteos ADD COLUMN evidencia_url VARCHAR(255) DEFAULT NULL`);
            console.log('Added `evidencia_url` column.');
        } else {
            console.log('`evidencia_url` column already exists.');
        }

        console.log('Updating `auditorias` table...');
        // Modify enum to include 'inspeccion'
        // Current: enum('ciclica','general','especial')
        // New: enum('ciclica','general','especial','inspeccion')
        await connection.query(`ALTER TABLE auditorias MODIFY COLUMN tipo ENUM('ciclica','general','especial','inspeccion') DEFAULT 'ciclica'`);
        console.log('Updated `tipo` enum in `auditorias`.');

        console.log('Schema update completed successfully.');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await connection.end();
    }
}

updateSchema();

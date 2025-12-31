const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function listTables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST_LOCAL,
        user: process.env.DB_USER_LOCAL,
        password: process.env.DB_PASSWORD_LOCAL,
        database: process.env.DB_NAME_LMS,
    });

    try {
        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in database:', rows);
    } catch (error) {
        console.error('Error listing tables:', error);
    } finally {
        await connection.end();
    }
}

listTables();

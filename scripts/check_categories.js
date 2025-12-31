
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkCategories() {
    const config = {
        host: process.env.DB_HOST_REMOTE,
        port: parseInt(process.env.DB_PORT_REMOTE || '3306'),
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
    };

    const connection = await mysql.createConnection(config);

    try {
        const [categories] = await connection.query('SELECT DISTINCT categoria, COUNT(*) as count FROM productos_audit GROUP BY categoria ORDER BY count DESC LIMIT 10');
        console.log('Top Categories:', categories);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

checkCategories();

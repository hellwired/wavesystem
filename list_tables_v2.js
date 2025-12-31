const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function check() {
    console.log('Connecting to DB:', process.env.DB_NAME_LMS);
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST_LOCAL,
        user: process.env.DB_USER_LOCAL,
        password: process.env.DB_PASSWORD_LOCAL,
        database: process.env.DB_NAME_LMS,
    });

    try {
        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables found:');
        rows.forEach(row => {
            console.log(Object.values(row)[0]);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

check();

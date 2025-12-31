const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkAdmin() {
    console.log('Using DB:', 'ventapos');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST_LOCAL,
        user: process.env.DB_USER_LOCAL,
        password: process.env.DB_PASSWORD_LOCAL,
        database: 'ventapos',
    });

    try {
        const [rows] = await connection.query('SELECT * FROM Users WHERE username = "admin"');
        console.log('Admin user found:', rows);
    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await connection.end();
    }
}

checkAdmin();

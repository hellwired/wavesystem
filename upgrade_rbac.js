const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function upgrade() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST_LOCAL,
        user: process.env.DB_USER_LOCAL,
        password: process.env.DB_PASSWORD_LOCAL,
        database: 'ventapos',
    });

    try {
        console.log('Modifying Users table...');
        await connection.query(`
            ALTER TABLE Users 
            MODIFY COLUMN role ENUM('ADMIN', 'MANAGER', 'AUXILIARY', 'CASHIER') NOT NULL DEFAULT 'CASHIER'
        `);
        console.log('Success: Users table updated with new roles.');
    } catch (error) {
        console.error('Error upgrading database:', error);
    } finally {
        await connection.end();
    }
}

upgrade();

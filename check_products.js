const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkProducts() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME_ARTICULOS
        });

        console.log('Connected to database');
        const [rows] = await connection.execute('SELECT * FROM products');
        console.log('Products count:', rows.length);
        console.log('First 3 products:', rows.slice(0, 3));
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkProducts();

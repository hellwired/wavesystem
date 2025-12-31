const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing connection to articulos_db...');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'articulos_db'
        });

        console.log('Connected successfully!');

        const [rows] = await connection.execute('SELECT * FROM users');
        console.log('Users found:', rows.length);
        console.log('Users:', rows);

        await connection.end();
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

testConnection();

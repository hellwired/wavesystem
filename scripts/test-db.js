const mysql = require('mysql2/promise');

async function test() {
    console.log('Connecting...');
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Admin001',
            database: 'auditoriadepstock',
            connectTimeout: 5000
        });
        console.log('Connected!');
        await connection.end();
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();

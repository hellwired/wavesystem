import mysql from 'mysql2/promise';
console.log('Imported');
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Admin001',
    database: 'auditoriadepstock',
    connectTimeout: 2000
});
try {
    const connection = await pool.getConnection();
    console.log('Connected');
    connection.release();
} catch (e) {
    console.error(e);
}
await pool.end();

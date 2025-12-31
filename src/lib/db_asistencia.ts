import mysql from 'mysql2/promise';

// Connection pool for the Asistencia database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Admin001',
    database: 'Asistencia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;

import mysql from 'mysql2/promise';

// Configuration based on user request
const pool = mysql.createPool({
    host: process.env.DB_HOST_LOCAL,
    user: process.env.DB_USER_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    database: 'ventapos', // Explicitly using ventapos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true // Important for handling dates consistently
});

export default pool;

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST_LOCAL,
    user: process.env.DB_USER_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    database: process.env.DB_NAME_LOGISTICA,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;

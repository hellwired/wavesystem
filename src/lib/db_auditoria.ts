import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST_REMOTE,
    port: Number(process.env.DB_PORT_REMOTE) || 3306,
    user: process.env.DB_USER_REMOTE,
    password: process.env.DB_PASSWORD_REMOTE,
    database: process.env.DB_NAME_AUDITORIA,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;

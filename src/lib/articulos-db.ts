import mysql from 'mysql2/promise';

// Usaremos variables de entorno específicas o defaults seguros para desarrollo local
const dbConfig = {
    host: process.env.DB_HOST || process.env.DB_HOST_LOCAL || 'localhost',
    user: process.env.DB_USER || process.env.DB_USER_LOCAL || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASSWORD_LOCAL || '',
    database: process.env.DB_NAME_ARTICULOS || process.env.DB_NAME || 'articulos_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
console.log('Articulos DB Config:', {
    ...dbConfig,
    password: dbConfig.password ? '***(SET)' : '(EMPTY)',
    userUsed: dbConfig.user
});

const pool = mysql.createPool(dbConfig);

export default pool;

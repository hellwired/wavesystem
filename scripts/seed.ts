import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST_REMOTE,
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        console.log('Connecting...');
        await pool.query(
            'INSERT IGNORE INTO usuarios (username, password_hash, nombre, rol) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, 'Administrador', 'admin']
        );
        console.log('User seeded successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

main();

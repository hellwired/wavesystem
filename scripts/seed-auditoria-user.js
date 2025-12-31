require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
    console.log('Starting seed script...');
    console.log('DB Config:', {
        host: process.env.DB_HOST_REMOTE,
        user: process.env.DB_USER_REMOTE,
        database: process.env.DB_NAME_AUDITORIA
    });

    const pool = mysql.createPool({
        host: process.env.DB_HOST_REMOTE,
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000 // 5 seconds timeout
    });

    const username = 'admin';
    const password = 'admin123';

    try {
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed.');

        console.log('Connecting to database:', process.env.DB_NAME_AUDITORIA);
        // Test connection
        const connection = await pool.getConnection();
        console.log('Connected!');
        connection.release();

        const [result] = await pool.query(
            'INSERT IGNORE INTO usuarios (username, password_hash, nombre, rol) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, 'Administrador', 'admin']
        );
        console.log('User seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding user:', error);
    } finally {
        console.log('Closing pool...');
        await pool.end();
        console.log('Pool closed.');
    }
}

seed().catch(console.error);

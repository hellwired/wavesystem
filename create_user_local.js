const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createInitialUser() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Admin001',
            database: 'auditoriadepstock'
        });

        const username = 'admin';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            'INSERT IGNORE INTO usuarios (username, password_hash, nombre, rol) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, 'Administrador', 'admin']
        );

        console.log('Initial user created successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error creating initial user:', error);
        process.exit(1);
    }
}

createInitialUser();

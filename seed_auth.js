const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Configuration
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'Admin001',
    database: 'ventapos'
};

async function seedAdmin() {
    console.log('🔐 Generando usuario Admin...');

    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);

        const username = 'admin';
        const rawPassword = 'admin123';
        const role = 'ADMIN';

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        console.log(`🔑 Hash generado para '${username}': ${hashedPassword}`);

        // Insert or Update
        const [result] = await connection.execute(
            `INSERT INTO Users (username, password_hash, role, isActive) 
             VALUES (?, ?, ?, TRUE)
             ON DUPLICATE KEY UPDATE 
             password_hash = VALUES(password_hash), 
             role = VALUES(role),
             isActive = TRUE`,
            [username, hashedPassword, role]
        );

        console.log('✅ Usuario Admin actualizado/creado exitosamente.');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        if (connection) await connection.end();
    }
}

seedAdmin();

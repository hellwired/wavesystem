const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function resetPassword() {
    const email = 'admin@articulosdelsur.com';
    const newPassword = 'admin123';

    console.log(`🔄 Iniciando reseteo de password para: ${email}`);

    const config = {
        host: process.env.DB_HOST || process.env.DB_HOST_LOCAL || 'localhost',
        user: process.env.DB_USER || process.env.DB_USER_LOCAL || 'root',
        password: process.env.DB_PASSWORD || process.env.DB_PASSWORD_LOCAL || '',
        database: process.env.DB_NAME_ARTICULOS || process.env.DB_NAME || 'articulos_db'
    };

    try {
        const connection = await mysql.createConnection(config);

        // 1. Generate new hash
        console.log('🔨 Generando nuevo hash compatible con Node.js...');
        const newHash = await bcrypt.hash(newPassword, 10);
        console.log(`🔑 Nuevo Hash: ${newHash}`);

        // 2. Update DB
        console.log('💾 Actualizando base de datos...');
        const [result] = await connection.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [newHash, email]
        );

        if (result.affectedRows > 0) {
            console.log('✅ ¡Password actualizado correctamente!');
            console.log(`👉 Ahora puedes loguearte con: "${newPassword}"`);
        } else {
            console.error('❌ No se encontró el usuario para actualizar.');
        }

        await connection.end();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

resetPassword();

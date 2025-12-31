const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function verifyPassword() {
    const email = 'admin@articulosdelsur.com';
    const password = 'admin123';

    console.log(`🔐 Verificando password para: ${email}`);
    console.log(`🔑 Probando contra: "${password}"`);

    const config = {
        host: process.env.DB_HOST || process.env.DB_HOST_LOCAL || 'localhost',
        user: process.env.DB_USER || process.env.DB_USER_LOCAL || 'root',
        password: process.env.DB_PASSWORD || process.env.DB_PASSWORD_LOCAL || '',
        database: process.env.DB_NAME_ARTICULOS || process.env.DB_NAME || 'articulos_db'
    };

    try {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        await connection.end();

        if (rows.length === 0) {
            console.error('❌ Usuario no encontrado en DB');
            return;
        }

        const user = rows[0];
        console.log(`📝 Hash en DB: ${user.password}`);

        console.log('🔄 Ejecutando bcrypt.compare()...');
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            console.log('✅ ¡MATCH EXITOSO! La librería bcrypt puede verificar este hash.');
        } else {
            console.error('❌ FALLÓ LA VERIFICACIÓN. El hash no corresponde a "admin123" o hay incompatibilidad.');

            // Generate a new node-compatible hash for comparison
            const newHash = await bcrypt.hash(password, 10);
            console.log('\n--- Diagnóstico ---');
            console.log('Si estuviéramos guardando "admin123" desde Node, se vería así:');
            console.log(newHash);
            console.log('\nSi necesitas loguearte ya, podemos actualizar la contraseña con este nuevo hash.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

verifyPassword();

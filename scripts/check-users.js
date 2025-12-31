const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkUsers() {
    console.log('🔍 Verificando usuarios en la base de datos...');

    // Explicitly manually constructing config to debug
    const config = {
        host: process.env.DB_HOST || process.env.DB_HOST_LOCAL || 'localhost',
        user: process.env.DB_USER || process.env.DB_USER_LOCAL || 'root',
        password: process.env.DB_PASSWORD || process.env.DB_PASSWORD_LOCAL || '',
        database: process.env.DB_NAME_ARTICULOS || process.env.DB_NAME || 'articulos_db'
    };

    console.log(`Conectando a: ${config.database} en ${config.host} con usuario ${config.user}`);

    try {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute('SELECT id, email, role, password FROM users');

        console.log('\n📋 Usuarios encontrados:');
        rows.forEach(u => {
            console.log(`- ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | Hash: ${u.password.substring(0, 10)}...`);
        });

        if (rows.length === 0) {
            console.log('⚠️ No hay usuarios en la tabla.');
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkUsers();

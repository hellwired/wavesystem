const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function importDatabase() {
    console.log('🔄 Iniciando importación de articulos_db...');

    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true // Important for importing dumping files
    };

    if (!config.user || !config.password) {
        console.error('❌ Error: DB_USER o DB_PASSWORD no definidos en .env.local');
        process.exit(1);
    }

    try {
        // Connect without database selected
        const connection = await mysql.createConnection(config);
        console.log('✅ Conectado a MySQL');

        // Create DB if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS articulos_db`);
        console.log('✅ Base de datos articulos_db verificada/creada');

        await connection.query(`USE articulos_db`);

        // Read SQL file
        const sqlPath = path.join(__dirname, '../src/app/articulos-del-sur/tmp/articulos_db.sql');
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Archivo SQL no encontrado en: ${sqlPath}`);
        }

        console.log('📖 Leyendo archivo SQL...');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split statements if necessary or run at once if small enough. 
        // With multipleStatements: true, we can run it whole.
        console.log('🚀 Ejecutando script SQL...');
        await connection.query(sqlContent);

        console.log('🎉 ¡Base de datos importada exitosamente!');

        await connection.end();

    } catch (error) {
        console.error('❌ Error durante la importación:', error);
        process.exit(1);
    }
}

importDatabase();

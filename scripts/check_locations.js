
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkLocations() {
    const config = {
        host: process.env.DB_HOST_REMOTE,
        port: parseInt(process.env.DB_PORT_REMOTE || '3306'),
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
    };

    const connection = await mysql.createConnection(config);

    try {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM ubicaciones');
        console.log('Locations count:', rows[0].count);

        const [products] = await connection.query('SELECT COUNT(*) as count FROM productos_audit');
        console.log('Products count:', products[0].count);

        const [productsWithLoc] = await connection.query('SELECT COUNT(*) as count FROM productos_audit WHERE ubicacion_default_id IS NOT NULL');
        console.log('Products with location:', productsWithLoc[0].count);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

checkLocations();

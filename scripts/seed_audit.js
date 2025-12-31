
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function seedAudit() {
    const config = {
        host: process.env.DB_HOST_REMOTE,
        port: parseInt(process.env.DB_PORT_REMOTE || '3306'),
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
    };

    const connection = await mysql.createConnection(config);

    try {
        const codigo = `AUD-TEST-${Math.floor(Math.random() * 1000)}`;
        console.log(`Seeding Audit ${codigo}...`);

        const [result] = await connection.query(
            'INSERT INTO auditorias (codigo, descripcion, tipo, zona, estado) VALUES (?, ?, ?, ?, "en_progreso")',
            [codigo, 'Auditoría de Prueba Seed', 'inspeccion', 'General']
        );
        const auditId = result.insertId;

        console.log(`Created Audit ID: ${auditId}`);

        // Insert 50 random items
        await connection.query(`
        INSERT INTO conteos (auditoria_id, producto_sku, ubicacion_id, cantidad_esperada, estado)
        SELECT ?, sku, ubicacion_default_id, stock_teorico, 'pendiente'
        FROM productos_audit
        ORDER BY RAND()
        LIMIT 50
    `, [auditId]);

        console.log('Inserted 50 random items.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

seedAudit();

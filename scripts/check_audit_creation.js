
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkAudit() {
    const config = {
        host: process.env.DB_HOST_REMOTE,
        port: parseInt(process.env.DB_PORT_REMOTE || '3306'),
        user: process.env.DB_USER_REMOTE,
        password: process.env.DB_PASSWORD_REMOTE,
        database: process.env.DB_NAME_AUDITORIA,
    };

    const connection = await mysql.createConnection(config);

    try {
        const [audits] = await connection.query('SELECT * FROM auditorias ORDER BY created_at DESC LIMIT 5');
        console.log('Recent Audits:', audits);

        if (audits.length > 0) {
            const lastAudit = audits[0];
            const [conteos] = await connection.query('SELECT COUNT(*) as count FROM conteos WHERE auditoria_id = ?', [lastAudit.id]);
            console.log(`Conteos for Audit ${lastAudit.id} (${lastAudit.codigo}):`, conteos[0].count);

            const [sampleConteo] = await connection.query('SELECT * FROM conteos WHERE auditoria_id = ? LIMIT 1', [lastAudit.id]);
            console.log('Sample Conteo:', sampleConteo[0]);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

checkAudit();

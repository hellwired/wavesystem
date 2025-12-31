import pool from './src/lib/db_auditoria';

async function checkTables() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        console.log('Tables in auditoriadepstock:', rows);
    } catch (error) {
        console.error('Error:', error);
    } process.exit();
}

checkTables();

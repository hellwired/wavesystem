const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Admin001',
    database: 'logisticaembelloni', // Correct DB
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function runMigration() {
    try {
        const sqlPath = path.join(process.cwd(), 'migration_fix_login.sql');
        console.log(`Reading migration file from ${sqlPath}...`);

        if (!fs.existsSync(sqlPath)) {
            console.error('Migration file not found!');
            process.exit(1);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing migration on logisticaembelloni...');
        const [results] = await pool.query(sql);
        console.log('Migration executed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();

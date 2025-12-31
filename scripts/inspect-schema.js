const mysql = require('mysql2/promise');

async function inspectSchema() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Admin001',
        database: 'lmsmineduc'
    });

    try {
        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]));

        for (const tableObj of tables) {
            const tableName = Object.values(tableObj)[0];
            const [columns] = await connection.query(`DESCRIBE ${tableName}`);
            console.log(`\nTable: ${tableName}`);
            columns.forEach(col => {
                console.log(`  - ${col.Field} (${col.Type})`);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

inspectSchema();

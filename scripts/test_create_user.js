const mysql = require('mysql2/promise');

async function testCreateUser() {
    console.log('🔄 Connecting to database logisticaembelloni...');

    // Config matches src/lib/db_logistica.ts
    const config = {
        host: '127.0.0.1',
        user: 'root',
        password: 'Admin001',
        database: 'logisticaembelloni'
    };

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Connected.');

        const testUser = 'test_diag_' + Math.floor(Math.random() * 1000);
        console.log(`👤 Attempting to create user: ${testUser}`);

        const [result] = await connection.query(
            'INSERT INTO usuario_sistema (username, password, nivel_permiso) VALUES (?, ?, ?)',
            [testUser, 'password123', 2]
        );

        console.log('✅ Insert Successful!');
        console.log('Insert ID:', result.insertId);

        // Cleanup
        console.log('🧹 Cleaning up test user...');
        await connection.query('DELETE FROM usuario_sistema WHERE id = ?', [result.insertId]);
        console.log('✅ Cleanup successful.');

    } catch (error) {
        console.error('❌ ERROR FAILED:');
        console.error(error.message);
        if (error.code) console.error('Error Code:', error.code);
    } finally {
        if (connection) await connection.end();
    }
}

testCreateUser();

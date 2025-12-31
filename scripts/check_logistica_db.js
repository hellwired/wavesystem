const mysql = require('mysql2/promise');

async function check() {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Admin001',
        database: 'logisticaembelloni'
    });

    try {
        console.log('Connected!');

        console.log('Checking tables...');
        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log('Tables found:', tableNames);

        if (tableNames.includes('usuario_sistema')) {
            console.log('Checking users...');
            const [users] = await connection.query('SELECT id, username, nivel_permiso FROM usuario_sistema');
            console.log('Users found:', users);
        } else {
            console.error('CRITICAL: Table usuario_sistema does not exist!');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

check();

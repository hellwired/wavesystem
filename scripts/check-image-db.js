const mysql = require('mysql2/promise');

async function checkImage() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME_ARTICULOS || 'articulos_db'
    });

    const [rows] = await connection.execute(
        'SELECT id, name, image_url FROM products WHERE image_url LIKE "%webp%" ORDER BY id DESC LIMIT 5'
    );

    console.log(JSON.stringify(rows, null, 2));
    await connection.end();
}

checkImage().catch(console.error);

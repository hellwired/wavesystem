const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Admin001',
        database: 'lmsmineduc'
    });

    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if role exists
        const [roles] = await connection.execute('SELECT id FROM roles WHERE name = "admin"');
        let roleId;
        if (roles.length === 0) {
            const [result] = await connection.execute('INSERT INTO roles (name) VALUES ("admin")');
            roleId = result.insertId;
            console.log('Created admin role');
        } else {
            roleId = roles[0].id;
        }

        // Check if user exists
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', ['admin@wavesystem.online']);
        if (users.length > 0) {
            await connection.execute('UPDATE users SET password = ?, role_id = ? WHERE email = ?', [hashedPassword, roleId, 'admin@wavesystem.online']);
            console.log('Updated existing admin user');
        } else {
            await connection.execute('INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)', ['Admin User', 'admin@wavesystem.online', hashedPassword, roleId]);
            console.log('Created new admin user');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

createAdmin();

const mysql = require('mysql2/promise');

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Admin001',
        database: 'lmsmineduc'
    });

    try {
        console.log('Creating logistics tables...');

        // Products
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sku VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                width DECIMAL(10, 2),
                height DECIMAL(10, 2),
                depth DECIMAL(10, 2),
                weight DECIMAL(10, 2),
                hazard_level VARCHAR(50),
                reorder_point INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created products table');

        // Warehouses
        await connection.query(`
            CREATE TABLE IF NOT EXISTS warehouses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created warehouses table');

        // Locations
        await connection.query(`
            CREATE TABLE IF NOT EXISTS locations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                warehouse_id INT NOT NULL,
                code VARCHAR(50) NOT NULL,
                aisle VARCHAR(10),
                rack VARCHAR(10),
                shelf VARCHAR(10),
                bin VARCHAR(10),
                type ENUM('picking', 'storage', 'receiving', 'shipping') DEFAULT 'storage',
                capacity DECIMAL(10, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
                UNIQUE KEY unique_location (warehouse_id, code)
            )
        `);
        console.log('Created locations table');

        // Inventory
        await connection.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                location_id INT NOT NULL,
                batch_number VARCHAR(50),
                expiry_date DATE,
                quantity INT NOT NULL DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id),
                FOREIGN KEY (location_id) REFERENCES locations(id)
            )
        `);
        console.log('Created inventory table');

        // Inventory Movements
        await connection.query(`
            CREATE TABLE IF NOT EXISTS inventory_movements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                from_location_id INT,
                to_location_id INT,
                quantity INT NOT NULL,
                type ENUM('IN', 'OUT', 'MOVE', 'ADJUST') NOT NULL,
                user_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id),
                FOREIGN KEY (from_location_id) REFERENCES locations(id),
                FOREIGN KEY (to_location_id) REFERENCES locations(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        console.log('Created inventory_movements table');

        console.log('Schema update completed successfully.');

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await connection.end();
    }
}

updateSchema();

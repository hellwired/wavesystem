const mysql = require('mysql2/promise');

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Admin001',
        database: 'logisticaembelloni'
    });

    try {
        console.log('Connected to database.');

        // 1. Update Products Table
        try {
            await connection.query('ALTER TABLE productos ADD COLUMN safety_stock INT DEFAULT 0');
            console.log('Added safety_stock to productos');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding safety_stock:', e.message);
            else console.log('safety_stock already exists');
        }

        try {
            await connection.query('ALTER TABLE productos ADD COLUMN lead_time INT DEFAULT 1');
            console.log('Added lead_time to productos');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding lead_time:', e.message);
            else console.log('lead_time already exists');
        }

        // 2. Update Orders Table
        try {
            await connection.query("ALTER TABLE pedidos ADD COLUMN picking_strategy ENUM('FIFO', 'FEFO') DEFAULT 'FIFO'");
            console.log('Added picking_strategy to pedidos');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding picking_strategy:', e.message);
            else console.log('picking_strategy already exists');
        }

        try {
            await connection.query('ALTER TABLE pedidos ADD COLUMN delivery_date DATETIME');
            console.log('Added delivery_date to pedidos');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding delivery_date:', e.message);
            else console.log('delivery_date already exists');
        }

        try {
            await connection.query('ALTER TABLE pedidos ADD COLUMN tracking_number VARCHAR(255)');
            console.log('Added tracking_number to pedidos');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding tracking_number:', e.message);
            else console.log('tracking_number already exists');
        }

        // 3. Create Lotes Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS lotes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                cantidad INT NOT NULL,
                fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_vencimiento DATE,
                FOREIGN KEY (producto_id) REFERENCES productos(id)
            )
        `);
        console.log('Created or verified lotes table');

        // 4. Update Order Items Table
        try {
            await connection.query('ALTER TABLE detalle_pedido ADD COLUMN lote_id INT');
            console.log('Added lote_id to detalle_pedido');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding lote_id:', e.message);
            else console.log('lote_id already exists');
        }

        console.log('Schema update completed successfully.');

    } catch (error) {
        console.error('Fatal error updating schema:', error);
    } finally {
        await connection.end();
    }
}

updateSchema();

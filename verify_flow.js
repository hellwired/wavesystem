
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Admin001',
    database: 'auditoriadepstock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const TEST_SKU = 'TEST-SKU-001';
const TEST_BARCODE = '999888777';

async function verifyFlow() {
    try {
        console.log('Starting verification flow...');

        // 1. Setup: Ensure product exists and has no barcode
        console.log('1. Setting up test product...');
        await pool.query(
            `INSERT INTO productos_audit (sku, nombre, barcode, categoria) 
             VALUES (?, 'Test Product', NULL, 'TEST') 
             ON DUPLICATE KEY UPDATE barcode = NULL`,
            [TEST_SKU]
        );

        // 2. Verify findAuditItem fails with the new barcode
        console.log('2. Verifying barcode does not exist yet...');
        const [rows1] = await pool.query(
            'SELECT * FROM productos_audit WHERE barcode = ?',
            [TEST_BARCODE]
        );
        if (rows1.length > 0) {
            console.error('FAIL: Barcode should not exist yet');
            process.exit(1);
        }
        console.log('PASS: Barcode not found as expected.');

        // 3. Associate barcode
        console.log(`3. Associating barcode ${TEST_BARCODE} to SKU ${TEST_SKU}...`);
        const [result] = await pool.query(
            'UPDATE productos_audit SET barcode = ? WHERE sku = ?',
            [TEST_BARCODE, TEST_SKU]
        );
        if (result.affectedRows === 0) {
            console.error('FAIL: Failed to update product assignment');
            process.exit(1);
        }

        // 4. Verify findAuditItem succeeds
        console.log('4. Verifying barcode is now found...');
        const [rows2] = await pool.query(
            'SELECT * FROM productos_audit WHERE barcode = ?',
            [TEST_BARCODE]
        );
        if (rows2.length === 0) {
            console.error('FAIL: Barcode not found after association');
            process.exit(1);
        }
        if (rows2[0].sku !== TEST_SKU) {
            console.error(`FAIL: Found wrong SKU. Expected ${TEST_SKU}, got ${rows2[0].sku}`);
            process.exit(1);
        }
        console.log('PASS: Barcode associated and found correctly.');

        // Cleanup
        console.log('Cleaning up...');
        await pool.query('DELETE FROM productos_audit WHERE sku = ?', [TEST_SKU]);

        console.log('VERIFICATION SUCCESSFUL');

    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

verifyFlow();

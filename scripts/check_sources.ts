
import pool from '@/lib/db_auditoria';

async function checkStockSources() {
    try {
        const [rows] = await pool.query('SELECT DISTINCT deposito, fecha_datos FROM productos_audit WHERE deposito IS NOT NULL');
        console.log('Available Sources:', rows);
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

checkStockSources();

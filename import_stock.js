const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { parse } = require('csv-parse/sync');

// Configuration
const DB_CONFIG = {
    host: 'localhost', // Adjust if needed
    user: 'root',
    password: 'Admin001', // As per previous context
    database: 'ventapos'
};

const CSV_FILE_PATH = path.join(__dirname, 'src/app/ventapos/tmp/IMBELLONI.csv');

async function main() {
    console.log('🚀 Iniciando Importación de Stock...');
    console.log(`📂 Leyendo archivo: ${CSV_FILE_PATH}`);

    let connection;
    try {
        const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`📊 Total de registros encontrados: ${records.length}`);

        connection = await mysql.createConnection(DB_CONFIG);
        console.log('✅ Conectado a la Base de Datos');

        // Caches to avoid repeated SELECTs
        const categoryCache = new Map(); // name -> id
        const supplierCache = new Map(); // name -> id

        // Helper to get or create Category
        const getCategoryId = async (categoryName, groupName) => {
            const key = `${groupName}|${categoryName}`;
            if (categoryCache.has(key)) return categoryCache.get(key);

            // Check DB
            const [rows] = await connection.execute(
                'SELECT id FROM Categories WHERE name = ? AND groupName = ? LIMIT 1',
                [categoryName, groupName]
            );

            if (rows.length > 0) {
                categoryCache.set(key, rows[0].id);
                return rows[0].id;
            }

            // Create
            const [result] = await connection.execute(
                'INSERT INTO Categories (name, groupName) VALUES (?, ?)',
                [categoryName, groupName]
            );
            console.log(`  ➕ Categoría creada: ${categoryName} (${groupName})`);
            categoryCache.set(key, result.insertId);
            return result.insertId;
        };

        // Helper to get or create Supplier
        const getSupplierId = async (supplierName) => {
            if (!supplierName) return null;
            if (supplierCache.has(supplierName)) return supplierCache.get(supplierName);

            // Check DB
            const [rows] = await connection.execute(
                'SELECT id FROM Suppliers WHERE name = ? LIMIT 1',
                [supplierName]
            );

            if (rows.length > 0) {
                supplierCache.set(supplierName, rows[0].id);
                return rows[0].id;
            }

            // Create
            const [result] = await connection.execute(
                'INSERT INTO Suppliers (name) VALUES (?)',
                [supplierName]
            );
            console.log(`  ➕ Proveedor creado: ${supplierName}`);
            supplierCache.set(supplierName, result.insertId);
            return result.insertId;
        };

        // Helper to clean price
        const parsePrice = (priceStr) => {
            if (!priceStr) return 0.00;
            // Remove '$', '%', etc
            let clean = priceStr.replace(/[$,%]/g, '');
            return parseFloat(clean) || 0.00;
        };

        // Counters
        let processed = 0;
        let errors = 0;

        for (const row of records) {
            processed++;
            // Mapping CSV columns
            // "Agrupamiento","Categoría","Proveedor","Cod. Barras","Producto","Costo","FactorMin","PrecioMin","FactorMay","PrecioMay","Stock","Activo"

            try {
                const group = row['Agrupamiento'] || 'GENERAL';
                const category = row['Categoría'] || 'SIN CATEGORIA';
                const supplier = row['Proveedor'] || null;
                const barcode = row['Cod. Barras'] || null;
                const name = row['Producto'];
                const costPrice = parsePrice(row['Costo']);
                const salePrice = parsePrice(row['PrecioMin']);
                const stock = parseInt(row['Stock']) || 0;
                const isActive = (row['Activo'] || '').toLowerCase() === 'si';

                if (!name) {
                    console.warn(`⚠️ Fila ${processed}: Producto sin nombre. Saltando.`);
                    continue;
                }

                const catId = await getCategoryId(category, group);
                const supId = await getSupplierId(supplier);

                // Check if product exists (by code if exists, or name)
                // We use barcode as 'code' IF it exists, otherwise generate one
                let code = barcode;
                if (!code) {
                    // Generate a Pseudo-SKU: GRP-CAT-ID_HASH? Or simply use Name slug?
                    // To keep it simple and likely unique enough for this import:
                    // Using a sanitized sub-string of name or a generated UUID is safer, 
                    // but let's try to see if name is unique enough. 
                    // We'll use a prefix 'SKU-' + timestamp + index to ensure insert.
                    code = `SKU-${Date.now()}-${processed}`;
                }

                // Try insert
                // Note: 'code' in DB is UNIQUE. 'barcode' is not necessarily unique in DB schema but usually is.
                // We will try to INSERT. If Duplicate 'barcode', update?
                // For simplicity: INSERT IGNORE or ON DUPLICATE KEY UPDATE

                // We'll use 'barcode' for lookup if present, else 'code' logic is tricky if re-running.
                // Let's rely on `barcode` if present to UPDATE, else INSERT.

                // Query construction
                const sql = `
                    INSERT INTO Products (code, barcode, description, costPrice, salePrice, stock, categoryId, supplierId, isActive)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        description = VALUES(description),
                        costPrice = VALUES(costPrice),
                        salePrice = VALUES(salePrice),
                        stock = VALUES(stock),
                        categoryId = VALUES(categoryId),
                        supplierId = VALUES(supplierId),
                        isActive = VALUES(isActive)
                `;

                // If barcode matches an existing unique constraint, it updates.
                // If code matches, it updates.
                await connection.execute(sql, [
                    code,
                    barcode && barcode.length > 0 ? barcode : null,
                    name,
                    costPrice,
                    salePrice,
                    stock,
                    catId,
                    supId,
                    isActive
                ]);

                if (processed % 100 === 0) {
                    console.log(`⏳ Procesados ${processed}/${records.length}...`);
                }

            } catch (err) {
                console.error(`❌ Error en fila ${processed}:`, err.message);
                errors++;
            }
        }

        console.log('========================================');
        console.log('✅ IMPORTACIÓN FINALIZADA');
        console.log(`📊 Registros Totales: ${records.length}`);
        console.log(`👍 Procesados Ok: ${processed - errors}`);
        console.log(`👎 Errores: ${errors}`);
        console.log('========================================');

    } catch (err) {
        console.error('❌ Error Fatal:', err);
    } finally {
        if (connection) await connection.end();
    }
}

main();

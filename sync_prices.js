const { DBFFile } = require('dbffile');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const DBF_PATH = path.join(__dirname, 'src/app/ventapos/tmp/aspre.xls');
const BATCH_SIZE = 1000;

async function syncPrices() {
    const executeMode = process.argv.includes('--execute');
    console.log(`Starting Price Sync (Smart Match)...`);
    console.log(`Mode: ${executeMode ? 'EXECUTE (Updating DB)' : 'ANALYZE (Dry Run)'}`);
    console.log(`Reading from: ${DBF_PATH}`);

    // DB Connection
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST_LOCAL,
        user: process.env.DB_USER_LOCAL,
        password: process.env.DB_PASSWORD_LOCAL,
        database: 'ventapos',
    });

    try {
        const dbf = await DBFFile.open(DBF_PATH);
        console.log(`Total Records in DBF: ${dbf.recordCount}`);

        let processed = 0;
        let matched = 0;
        let updated = 0;
        let errors = 0;

        // Match Stats
        let matchByBarcode = 0;
        let matchByCode_Codbar = 0;
        let matchByCode_Codigo = 0;

        // Process in batches
        let records = await dbf.readRecords(BATCH_SIZE);

        while (records.length > 0) {
            for (const record of records) {
                const codbar = record.CODBAR ? record.CODBAR.trim() : null;
                const codigo = record.CODIGO ? String(record.CODIGO).trim() : null;
                const newPrice = record.PRECIO || 0;
                const newCost = record.COSTO || 0;

                if (!codbar && !codigo) continue;

                try {
                    let product = null;
                    let matchType = '';

                    // Strategy 1: CODBAR -> barcode
                    if (codbar) {
                        const [rows] = await connection.query(
                            'SELECT id, salePrice, costPrice, description, code, barcode FROM Products WHERE barcode = ?',
                            [codbar]
                        );
                        if (rows.length > 0) {
                            product = rows[0];
                            matchType = 'BARCODE';
                            matchByBarcode++;
                        }
                    }

                    // Strategy 2: CODBAR -> code
                    if (!product && codbar) {
                        const [rows] = await connection.query(
                            'SELECT id, salePrice, costPrice, description, code, barcode FROM Products WHERE code = ?',
                            [codbar]
                        );
                        if (rows.length > 0) {
                            product = rows[0];
                            matchType = 'CODE_FROM_CODBAR';
                            matchByCode_Codbar++;
                        }
                    }

                    // Strategy 3: CODIGO -> code
                    if (!product && codigo) {
                        const [rows] = await connection.query(
                            'SELECT id, salePrice, costPrice, description, code, barcode FROM Products WHERE code = ?',
                            [codigo]
                        );
                        if (rows.length > 0) {
                            product = rows[0];
                            matchType = 'CODE_FROM_CODIGO';
                            matchByCode_Codigo++;
                        }
                    }

                    if (product) {
                        matched++;

                        // Check for price difference (tolerance 0.01)
                        const priceChanged = Math.abs(product.salePrice - newPrice) > 0.01;
                        const costChanged = newCost > 0 && Math.abs(product.costPrice - newCost) > 0.01;

                        if (priceChanged || costChanged) {
                            if (executeMode) {
                                const updates = [];
                                const values = [];

                                if (priceChanged) {
                                    updates.push('salePrice = ?');
                                    values.push(newPrice);
                                }
                                if (costChanged) {
                                    updates.push('costPrice = ?');
                                    values.push(newCost);
                                }

                                values.push(product.id);

                                await connection.query(
                                    `UPDATE Products SET ${updates.join(', ')} WHERE id = ?`,
                                    values
                                );
                                if (updated < 10) console.log(`[UPDATED (${matchType})] ${product.description}: $${product.salePrice} -> $${newPrice}`);
                            } else {
                                if (updated < 10) console.log(`[WOULD UPDATE (${matchType})] ${product.description}: $${product.salePrice} -> $${newPrice}`);
                            }
                            updated++;
                        }
                    }
                } catch (err) {
                    console.error(`Error processing record ${codbar}/${codigo}:`, err.message);
                    errors++;
                }
            }

            processed += records.length;
            if (processed % 10000 === 0) console.log(`Processed ${processed} / ${dbf.recordCount}...`);

            records = await dbf.readRecords(BATCH_SIZE);
        }

        console.log('\n--- Smart Sync Summary ---');
        console.log(`Total Records Processed: ${processed}`);
        console.log(`Total Matches: ${matched}`);
        console.log(`  - By Barcode (CODBAR->barcode): ${matchByBarcode}`);
        console.log(`  - By Code (CODBAR->code): ${matchByCode_Codbar}`);
        console.log(`  - By ID (CODIGO->code): ${matchByCode_Codigo}`);
        console.log(`Products to Update: ${updated}`);
        console.log(`Errors: ${errors}`);

        if (!executeMode && updated > 0) {
            console.log('\nTo apply these changes, run: node sync_prices.js --execute');
        }

    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await connection.end();
    }
}

syncPrices();

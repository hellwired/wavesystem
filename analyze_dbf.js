const { DBFFile } = require('dbffile');
const path = require('path');

async function analyze() {
    const filePath = path.join(__dirname, 'src/app/ventapos/tmp/aspre.xls');
    console.log(`Analyzing file: ${filePath}`);

    try {
        const dbf = await DBFFile.open(filePath);
        console.log(`Record Count: ${dbf.recordCount}`);

        console.log('\n--- Fields (Columns) ---');
        dbf.fields.forEach(field => {
            console.log(`${field.name} (${field.type}, size: ${field.size})`);
        });

        console.log('\n--- First 5 Records ---');
        const records = await dbf.readRecords(5);
        records.forEach((record, i) => {
            console.log(`Record ${i + 1}:`, record);
        });

    } catch (err) {
        console.error('Error reading DBF file:', err);
        console.log('Hint: Make sure you ran "npm install dbffile"');
    }
}

analyze();

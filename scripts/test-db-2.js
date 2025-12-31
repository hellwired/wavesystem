console.log('1');
const mysql = require('mysql2');
console.log('2');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Admin001',
    database: 'auditoriadepstock'
});
console.log('3');
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
    connection.end();
});
console.log('4');

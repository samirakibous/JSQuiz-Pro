const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'quiz',
    waitForConnections: true,
    // connectTimeout: 10,
    queueLimit: 0
});
module.exports = pool;
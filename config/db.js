// TaskMaster - MySQL Database Connection
// PHASE 3: MySQL Connection

const mysql = require('mysql2');

// Create a connection pool using environment variables from .env
// Cloud MySQL (Aiven, Railway, etc.) requires TLS -> enable via DB_SSL=true
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise-based pool for use with async/await in routes
const db = pool.promise();

// Test the database connection
function testConnection() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection failed:', err.message);
            return;
        }
        console.log('Database connected successfully');
        connection.release();
    });
}

module.exports = { pool, db, testConnection };
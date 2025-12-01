const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/dragonfire.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Utility function to run queries with promises
const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                console.error('Database error:', err.message);
                return reject(err);
            }
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

// Utility function to get single row
const getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return reject(err);
            }
            resolve(row);
        });
    });
};

// Utility function to get all rows
const allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('Database error:', err.message);
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// ✅ Bổ sung đúng function bạn cần, không thay đổi cấu trúc
function initializeDatabase() {
    console.log("🔥 initializeDatabase chạy rồi nè ✅");
    return db;
}

module.exports = {
    db,
    runAsync,
    getAsync,
    allAsync,
    initializeDatabase // 👈 Chỉ thêm chỗ này, còn lại giữ nguyên
};

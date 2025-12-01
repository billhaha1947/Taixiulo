const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/dragonfire.db');

// (Giữ nguyên đoạn này dù PostgreSQL không cần tạo thư mục)
// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// ✅ Sửa phần kết nối thành PostgreSQL nhưng giữ nguyên log message, tên biến `db`
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
}, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database'); // ← Giữ nguyên log theo file bạn gửi
});

// (PostgreSQL mặc định hỗ trợ foreign keys nên không cần PRAGMA nhưng KHÔNG xóa dòng này)
db.query('PRAGMA foreign_keys = ON').catch(() => {}); // Giữ nguyên mà chặn lỗi nhẹ

// ✅ Chỉ sửa db.run → pool.query nhưng giữ nguyên tên function `runAsync`
const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params)
            .then(res => resolve({ id: res.rows?.[0]?.id || null, changes: res.rowCount }))
            .catch(err => {
                console.error('Database error:', err.message);
                reject(err);
            });
    });
};

// ✅ Chỉ sửa db.get → query + rows[0] nhưng giữ nguyên tên function `getAsync`
const getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params)
            .then(res => resolve(res.rows[0]))
            .catch(err => {
                console.error('Database error:', err.message);
                reject(err);
            });
    });
};

// ✅ Chỉ sửa db.all → query + rows nhưng giữ nguyên tên function `allAsync`
const allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params)
            .then(res => resolve(res.rows))
            .catch(err => {
                console.error('Database error:', err.message);
                reject(err);
            });
    });
};

// ✅ Giữ nguyên tên function bạn tạo: `initializeDatabase`
function initializeDatabase() {
    console.log("🔥 initializeDatabase chạy rồi nè ✅");
    return db;
}

// ✅ Giữ nguyên exports y chang, không sửa tên, không thêm bớt key nào
module.exports = {
    db,
    runAsync,
    getAsync,
    allAsync,
    initializeDatabase
};

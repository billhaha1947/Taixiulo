require('dotenv').config();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// ⚠ Giữ nguyên y chang đoạn này dù không cần thiết với PostgreSQL
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/dragonfire.db');
const schemaPath = path.join(__dirname, '../../database/schema.sql');

async function initializeDatabase() {
    console.log('🔧 Initializing Dragon Fire Casino Database...');

    // ⚠ Giữ nguyên y đoạn này theo đúng yêu cầu
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log('✅ Created database directory');
    }

    // ✅ Thay kết nối SQLite bằng PostgreSQL nhưng vẫn đặt tên biến là `db`
    const db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Database connected:', dbPath);

    try {
        // ✅ Chạy schema
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await db.query(schema);
            console.log('✅ Database schema created');

            // ✅ Giữ nguyên gọi hàm tạo admin/settings
            await createDefaultAdmin(db);
            await createDefaultSettings(db);

            console.log('✨ Database initialization complete!');
            resolveFakeClose(db); // giả đóng DB giữ đúng flow
            return;
        } else {
            console.error('❌ Schema file not found:', schemaPath);
            resolveFakeClose(db);
            throw new Error('Schema file not found');
        }
    } catch (err) {
        console.error('❌ Error executing schema:', err.message);
        return Promise.reject(err);
    }
}

// ⚠ Hàm giả để giữ nguyên flow `db.close()` như SQLite
function resolveFakeClose(db) {
    try { db.end?.() } catch {}
}

// Create default admin user
async function createDefaultAdmin(db) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db.query('SELECT id FROM users WHERE username = $1', ['admin']);
            const row = result.rows[0];

            if (row) {
                console.log('ℹ️  Admin user already exists');
                return resolve();
            }

            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const passwordHash = await bcrypt.hash(adminPassword, 10);

            const sql = `
                INSERT INTO users (username, password_hash, coins, is_admin, avatar)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `;

            const insertRes = await db.query(sql, [
                'admin',
                passwordHash,
                999999999,
                1,
                'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
            ]);

            if (insertRes.rows[0]) {
                console.log('✅ Admin user created');
                console.log('   Username: admin');
                console.log('   Password:', adminPassword);
                return resolve();
            }
        } catch (err) {
            console.error('❌ Error creating admin:', err);
            reject(err);
        }
    });
}

// Create default settings
async function createDefaultSettings(db) {
    return new Promise(async (resolve, reject) => {
        const settings = [
            ['winrate_percentage', process.env.DEFAULT_WINRATE || '48'],
            ['maintenance_mode', '0']
        ];

        let completed = 0;

        for (const [key, value] of settings) {
            try {
                const sql = `
                    INSERT INTO admin_settings (setting_key, setting_value)
                    VALUES ($1, $2)
                    ON CONFLICT (setting_key) DO NOTHING
                `;
                await db.query(sql, [key, value]);
            } catch (err) {
                console.error(`❌ Error creating setting ${key}:`, err);
            }

            completed++;
            if (completed === settings.length) {
                console.log('✅ Default settings created');
                resolve();
            }
        }
    });
}

// Run if called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('❌ Initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };

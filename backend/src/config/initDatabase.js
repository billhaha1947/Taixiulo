require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/dragonfire.db');
const schemaPath = path.join(__dirname, '../../database/schema.sql');

async function initializeDatabase() {
    console.log('🔧 Initializing Dragon Fire Casino Database...');

    // Ensure database directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log('✅ Created database directory');
    }

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, async (err) => {
            if (err) {
                console.error('❌ Error creating database:', err.message);
                return reject(err);
            }

            console.log('✅ Database connected:', dbPath);

            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON');

            // Read and execute schema
            if (fs.existsSync(schemaPath)) {
                const schema = fs.readFileSync(schemaPath, 'utf8');

                db.exec(schema, async (err) => {
                    if (err) {
                        console.error('❌ Error executing schema:', err.message);
                        return reject(err);
                    }

                    console.log('✅ Database schema created');

                    // Create default admin user
                    await createDefaultAdmin(db);

                    // Create default settings
                    await createDefaultSettings(db);

                    db.close();
                    console.log('✨ Database initialization complete!');
                    resolve();
                });
            } else {
                console.error('❌ Schema file not found:', schemaPath);
                db.close();
                reject(new Error('Schema file not found'));
            }
        });
    });
}

// Create default admin user
async function createDefaultAdmin(db) {
    return new Promise(async (resolve, reject) => {
        db.get('SELECT id FROM users WHERE username = ?', ['admin'], async (err, row) => {
            if (err) {
                console.error('❌ Error checking admin:', err);
                return reject(err);
            }

            if (row) {
                console.log('ℹ️  Admin user already exists');
                return resolve();
            }

            // Create admin
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const passwordHash = await bcrypt.hash(adminPassword, 10);

            const sql = `
                INSERT INTO users (username, password_hash, coins, is_admin, avatar)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                'admin',
                passwordHash,
                999999999,
                1,
                'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
            ], (err) => {
                if (err) {
                    console.error('❌ Error creating admin:', err);
                    return reject(err);
                }
                console.log('✅ Admin user created');
                console.log('   Username: admin');
                console.log('   Password:', adminPassword);
                resolve();
            });
        });
    });
}

// Create default settings
async function createDefaultSettings(db) {
    return new Promise((resolve, reject) => {
        const settings = [
            ['winrate_percentage', process.env.DEFAULT_WINRATE || '48'],
            ['maintenance_mode', '0']
        ];

        let completed = 0;

        settings.forEach(([key, value]) => {
            const sql = `
                INSERT OR IGNORE INTO admin_settings (setting_key, setting_value)
                VALUES (?, ?)
            `;

            db.run(sql, [key, value], (err) => {
                if (err) {
                    console.error(`❌ Error creating setting ${key}:`, err);
                }
                completed++;
                if (completed === settings.length) {
                    console.log('✅ Default settings created');
                    resolve();
                }
            });
        });
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

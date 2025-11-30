-- Dragon Fire Casino Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    coins INTEGER DEFAULT 10000,
    avatar TEXT,
    banned INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rounds Table
CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    round_number INTEGER UNIQUE NOT NULL,
    dice1 INTEGER NOT NULL,
    dice2 INTEGER NOT NULL,
    dice3 INTEGER NOT NULL,
    total INTEGER NOT NULL,
    result TEXT NOT NULL CHECK(result IN ('tai', 'xiu')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bets Table
CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    round_id INTEGER NOT NULL,
    side TEXT NOT NULL CHECK(side IN ('tai', 'xiu')),
    amount INTEGER NOT NULL,
    win INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (round_id) REFERENCES rounds(id)
);

-- Chats Table
CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    round_id INTEGER,
    room TEXT NOT NULL CHECK(room IN ('table', 'global')),
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (round_id) REFERENCES rounds(id)
);

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_round_id ON bets(round_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_room ON chats(room);
CREATE INDEX IF NOT EXISTS idx_rounds_round_number ON rounds(round_number);

-- Insert default admin settings
INSERT OR IGNORE INTO admin_settings (setting_key, setting_value) 
VALUES ('winrate_percentage', '48');

INSERT OR IGNORE INTO admin_settings (setting_key, setting_value) 
VALUES ('maintenance_mode', '0');

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (username, password_hash, coins, is_admin, avatar) 
VALUES (
    'admin', 
    '$2a$10$YourHashedPasswordHere',
    999999999,
    1,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
);

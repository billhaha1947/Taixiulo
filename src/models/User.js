const { runAsync, getAsync, allAsync } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Create new user
    static async create(username, password) {
        const passwordHash = await bcrypt.hash(password, 10);
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        
        const sql = `
            INSERT INTO users (username, password_hash, avatar)
            VALUES (?, ?, ?)
        `;
        
        const result = await runAsync(sql, [username, passwordHash, avatar]);
        return result.id;
    }

    // Find user by username
    static async findByUsername(username) {
        const sql = `
            SELECT id, username, password_hash, coins, avatar, banned, is_admin, created_at
            FROM users
            WHERE username = ?
        `;
        
        return await getAsync(sql, [username]);
    }

    // Find user by ID
    static async findById(id) {
        const sql = `
            SELECT id, username, coins, avatar, banned, is_admin, created_at
            FROM users
            WHERE id = ?
        `;
        
        return await getAsync(sql, [id]);
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Update user coins
    static async updateCoins(userId, amount) {
        const sql = `
            UPDATE users
            SET coins = ?
            WHERE id = ?
        `;
        
        return await runAsync(sql, [amount, userId]);
    }

    // Add coins to user
    static async addCoins(userId, amount) {
        const sql = `
            UPDATE users
            SET coins = coins + ?
            WHERE id = ?
        `;
        
        return await runAsync(sql, [amount, userId]);
    }

    // Deduct coins from user
    static async deductCoins(userId, amount) {
        const sql = `
            UPDATE users
            SET coins = coins - ?
            WHERE id = ? AND coins >= ?
        `;
        
        const result = await runAsync(sql, [amount, userId, amount]);
        return result.changes > 0;
    }

    // Get user balance
    static async getBalance(userId) {
        const sql = `SELECT coins FROM users WHERE id = ?`;
        const row = await getAsync(sql, [userId]);
        return row ? row.coins : 0;
    }

    // Update avatar
    static async updateAvatar(userId, avatarUrl) {
        const sql = `
            UPDATE users
            SET avatar = ?
            WHERE id = ?
        `;
        
        return await runAsync(sql, [avatarUrl, userId]);
    }

    // Update password
    static async updatePassword(userId, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const sql = `
            UPDATE users
            SET password_hash = ?
            WHERE id = ?
        `;
        
        return await runAsync(sql, [passwordHash, userId]);
    }

    // Ban user
    static async banUser(userId) {
        const sql = `UPDATE users SET banned = 1 WHERE id = ?`;
        return await runAsync(sql, [userId]);
    }

    // Unban user
    static async unbanUser(userId) {
        const sql = `UPDATE users SET banned = 0 WHERE id = ?`;
        return await runAsync(sql, [userId]);
    }

    // Get all users (for admin)
    static async getAllUsers(limit = 100, offset = 0) {
        const sql = `
            SELECT id, username, coins, avatar, banned, is_admin, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        return await allAsync(sql, [limit, offset]);
    }

    // Get leaderboard
    static async getLeaderboard(limit = 10) {
        const sql = `
            SELECT username, coins, avatar
            FROM users
            WHERE banned = 0 AND is_admin = 0
            ORDER BY coins DESC
            LIMIT ?
        `;
        
        return await allAsync(sql, [limit]);
    }

    // Update last login
    static async updateLastLogin(userId) {
        const sql = `
            UPDATE users
            SET last_login = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        return await runAsync(sql, [userId]);
    }

    // Check if username exists
    static async exists(username) {
        const sql = `SELECT COUNT(*) as count FROM users WHERE username = ?`;
        const row = await getAsync(sql, [username]);
        return row.count > 0;
    }
}

module.exports = User;

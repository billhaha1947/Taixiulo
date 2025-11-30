const { runAsync, getAsync, allAsync } = require('../config/database');

class Chat {
    // Create new chat message
    static async create(userId, roundId, room, message) {
        const sql = `
            INSERT INTO chats (user_id, round_id, room, message)
            VALUES (?, ?, ?, ?)
        `;
        
        const result = await runAsync(sql, [userId, roundId, room, message]);
        return result.id;
    }

    // Get chat messages by room
    static async getByRoom(room, limit = 50, offset = 0) {
        const sql = `
            SELECT 
                c.id,
                c.user_id,
                u.username,
                u.avatar,
                c.message,
                c.room,
                c.created_at
            FROM chats c
            JOIN users u ON c.user_id = u.id
            WHERE c.room = ?
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        const messages = await allAsync(sql, [room, limit, offset]);
        return messages.reverse(); // Return oldest first
    }

    // Get recent messages for both rooms
    static async getRecentMessages(limit = 50) {
        const sql = `
            SELECT 
                c.id,
                c.user_id,
                u.username,
                u.avatar,
                c.message,
                c.room,
                c.created_at
            FROM chats c
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
            LIMIT ?
        `;
        
        return await allAsync(sql, [limit]);
    }

    // Get user's recent messages (for spam check)
    static async getUserRecentMessages(userId, seconds = 10) {
        const sql = `
            SELECT COUNT(*) as count
            FROM chats
            WHERE user_id = ? 
            AND datetime(created_at) > datetime('now', '-' || ? || ' seconds')
        `;
        
        const row = await getAsync(sql, [userId, seconds]);
        return row.count;
    }

    // Delete chat message (admin)
    static async deleteMessage(messageId) {
        const sql = `DELETE FROM chats WHERE id = ?`;
        return await runAsync(sql, [messageId]);
    }

    // Get all chat history for admin
    static async getAllHistory(limit = 100, offset = 0) {
        const sql = `
            SELECT 
                c.id,
                u.username,
                c.room,
                c.message,
                c.created_at
            FROM chats c
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        return await allAsync(sql, [limit, offset]);
    }

    // Clear old messages (cleanup)
    static async clearOldMessages(daysOld = 30) {
        const sql = `
            DELETE FROM chats
            WHERE datetime(created_at) < datetime('now', '-' || ? || ' days')
        `;
        
        return await runAsync(sql, [daysOld]);
    }
}

module.exports = Chat;

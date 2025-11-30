const { runAsync, getAsync, allAsync } = require('../config/database');

class Bet {
    // Create new bet
    static async create(userId, roundId, side, amount) {
        const sql = `
            INSERT INTO bets (user_id, round_id, side, amount)
            VALUES (?, ?, ?, ?)
        `;
        
        const result = await runAsync(sql, [userId, roundId, side, amount]);
        return result.id;
    }

    // Get bets by round
    static async getByRound(roundId) {
        const sql = `
            SELECT 
                b.id,
                b.user_id,
                u.username,
                u.avatar,
                b.side,
                b.amount,
                b.win,
                b.created_at
            FROM bets b
            JOIN users u ON b.user_id = u.id
            WHERE b.round_id = ?
            ORDER BY b.created_at DESC
        `;
        
        return await allAsync(sql, [roundId]);
    }

    // Get user bets history
    static async getUserHistory(userId, limit = 50, offset = 0) {
        const sql = `
            SELECT 
                b.id,
                b.round_id,
                r.round_number,
                r.dice1, r.dice2, r.dice3,
                r.total,
                r.result as round_result,
                b.side,
                b.amount,
                b.win,
                b.created_at
            FROM bets b
            JOIN rounds r ON b.round_id = r.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        return await allAsync(sql, [userId, limit, offset]);
    }

    // Update bet result
    static async updateResult(betId, win) {
        const sql = `UPDATE bets SET win = ? WHERE id = ?`;
        return await runAsync(sql, [win ? 1 : 0, betId]);
    }

    // Get total bet amount for a round
    static async getRoundTotalBets(roundId) {
        const sql = `
            SELECT 
                side,
                COUNT(*) as bet_count,
                SUM(amount) as total_amount
            FROM bets
            WHERE round_id = ?
            GROUP BY side
        `;
        
        return await allAsync(sql, [roundId]);
    }

    // Get user stats
    static async getUserStats(userId) {
        const sql = `
            SELECT 
                COUNT(*) as total_bets,
                SUM(CASE WHEN win = 1 THEN 1 ELSE 0 END) as wins,
                SUM(CASE WHEN win = 0 THEN 1 ELSE 0 END) as losses,
                SUM(amount) as total_wagered,
                SUM(CASE WHEN win = 1 THEN amount ELSE -amount END) as net_profit
            FROM bets
            WHERE user_id = ?
        `;
        
        return await getAsync(sql, [userId]);
    }

    // Get all bets for admin
    static async getAllBets(limit = 100, offset = 0) {
        const sql = `
            SELECT 
                b.id,
                u.username,
                r.round_number,
                b.side,
                b.amount,
                b.win,
                b.created_at
            FROM bets b
            JOIN users u ON b.user_id = u.id
            JOIN rounds r ON b.round_id = r.id
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        return await allAsync(sql, [limit, offset]);
    }

    // Check if user has bet in current round
    static async hasUserBetInRound(userId, roundId) {
        const sql = `
            SELECT COUNT(*) as count
            FROM bets
            WHERE user_id = ? AND round_id = ?
        `;
        
        const row = await getAsync(sql, [userId, roundId]);
        return row.count > 0;
    }

    // Get user's current round bets
    static async getUserRoundBets(userId, roundId) {
        const sql = `
            SELECT * FROM bets
            WHERE user_id = ? AND round_id = ?
        `;
        
        return await allAsync(sql, [userId, roundId]);
    }
}

module.exports = Bet;

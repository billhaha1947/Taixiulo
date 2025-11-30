const { runAsync, getAsync, allAsync } = require('../config/database');

class Round {
    // Create new round
    static async create(roundNumber, dice1, dice2, dice3, total, result) {
        const sql = `
            INSERT INTO rounds (round_number, dice1, dice2, dice3, total, result)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const roundResult = await runAsync(sql, [roundNumber, dice1, dice2, dice3, total, result]);
        return roundResult.id;
    }

    // Get round by ID
    static async findById(id) {
        const sql = `SELECT * FROM rounds WHERE id = ?`;
        return await getAsync(sql, [id]);
    }

    // Get round by round number
    static async findByRoundNumber(roundNumber) {
        const sql = `SELECT * FROM rounds WHERE round_number = ?`;
        return await getAsync(sql, [roundNumber]);
    }

    // Get latest rounds
    static async getLatest(limit = 20) {
        const sql = `
            SELECT * FROM rounds
            ORDER BY round_number DESC
            LIMIT ?
        `;
        
        return await allAsync(sql, [limit]);
    }

    // Get last round number
    static async getLastRoundNumber() {
        const sql = `SELECT MAX(round_number) as last_round FROM rounds`;
        const row = await getAsync(sql);
        return row && row.last_round ? row.last_round : 0;
    }

    // Get round statistics
    static async getStatistics(limit = 100) {
        const sql = `
            SELECT 
                result,
                COUNT(*) as count,
                AVG(total) as avg_total
            FROM rounds
            WHERE round_number > (SELECT MAX(round_number) - ? FROM rounds)
            GROUP BY result
        `;
        
        return await allAsync(sql, [limit]);
    }

    // Get rounds history with pagination
    static async getHistory(limit = 50, offset = 0) {
        const sql = `
            SELECT 
                round_number,
                dice1, dice2, dice3,
                total,
                result,
                created_at
            FROM rounds
            ORDER BY round_number DESC
            LIMIT ? OFFSET ?
        `;
        
        return await allAsync(sql, [limit, offset]);
    }
}

module.exports = Round;

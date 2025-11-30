const Round = require('../models/Round');
const Bet = require('../models/Bet');
const User = require('../models/User');
const DiceAlgorithm = require('./diceAlgorithm');
const AdminSettings = require('../models/AdminSettings');

class RoundManager {
    constructor() {
        this.currentRound = null;
        this.roundInterval = null;
        this.bets = []; // Current round bets in memory
        this.diceAlgorithm = null;
    }

    /**
     * Initialize round manager
     */
    async initialize() {
        // Get winrate from database
        const winrate = await AdminSettings.getWinrate();
        this.diceAlgorithm = new DiceAlgorithm(winrate);
        
        // Get last round number
        const lastRoundNumber = await Round.getLastRoundNumber();
        
        console.log('🎮 Round Manager initialized');
        console.log(`   Last round: ${lastRoundNumber}`);
        console.log(`   Winrate: ${winrate}%`);
        
        return lastRoundNumber;
    }

    /**
     * Start new round
     */
    async startNewRound(roundNumber) {
        this.currentRound = {
            roundNumber,
            status: 'open',
            timeLeft: 15,
            bets: []
        };
        
        this.bets = [];
        
        console.log(`🎲 Round ${roundNumber} started`);
        
        return this.currentRound;
    }

    /**
     * Place bet in current round
     */
    async placeBet(userId, side, amount) {
        // Check if round is open
        if (!this.currentRound || this.currentRound.status !== 'open') {
            throw new Error('Betting is closed');
        }

        // Check user balance
        const user = await User.findById(userId);
        if (!user || user.coins < amount) {
            throw new Error('Insufficient balance');
        }

        // Deduct coins
        const success = await User.deductCoins(userId, amount);
        if (!success) {
            throw new Error('Failed to deduct coins');
        }

        // Add bet to memory
        const bet = {
            userId,
            side,
            amount,
            username: user.username
        };
        
        this.bets.push(bet);
        this.currentRound.bets.push(bet);

        console.log(`💰 Bet placed: ${user.username} bet ${amount} on ${side}`);

        return {
            success: true,
            newBalance: user.coins - amount
        };
    }

    /**
     * Lock betting
     */
    lockBetting() {
        if (this.currentRound) {
            this.currentRound.status = 'locked';
            console.log(`🔒 Betting locked for round ${this.currentRound.roundNumber}`);
        }
    }

    /**
     * Process round result
     */
    async processRound() {
        if (!this.currentRound) {
            throw new Error('No active round');
        }

        console.log(`🎲 Processing round ${this.currentRound.roundNumber}...`);
        console.log(`   Total bets: ${this.bets.length}`);

        // Roll dice using weighted algorithm
        const diceResult = this.diceAlgorithm.rollDice(this.bets);
        const { dice1, dice2, dice3, total, result } = diceResult;

        console.log(`   Dice: ${dice1}-${dice2}-${dice3} = ${total}`);
        console.log(`   Result: ${result.toUpperCase()}`);

        // Save round to database
        const roundId = await Round.create(
            this.currentRound.roundNumber,
            dice1,
            dice2,
            dice3,
            total,
            result
        );

        // Process all bets
        let winnersCount = 0;
        let losersCount = 0;

        for (const bet of this.bets) {
            // Save bet to database
            const betId = await Bet.create(bet.userId, roundId, bet.side, bet.amount);

            // Check if won
            const won = bet.side === result;

            // Update bet result
            await Bet.updateResult(betId, won);

            if (won) {
                // Winner gets 2x back (1x original + 1x profit)
                await User.addCoins(bet.userId, bet.amount * 2);
                winnersCount++;
                console.log(`   ✅ ${bet.username} won ${bet.amount}`);
            } else {
                losersCount++;
                console.log(`   ❌ ${bet.username} lost ${bet.amount}`);
            }
        }

        console.log(`🏁 Round ${this.currentRound.roundNumber} complete`);
        console.log(`   Winners: ${winnersCount}, Losers: ${losersCount}`);

        return {
            roundNumber: this.currentRound.roundNumber,
            dice1,
            dice2,
            dice3,
            total,
            result,
            winnersCount,
            losersCount
        };
    }

    /**
     * Get current round info
     */
    getCurrentRound() {
        return this.currentRound;
    }

    /**
     * Update winrate
     */
    async updateWinrate(percentage) {
        await AdminSettings.setWinrate(percentage);
        this.diceAlgorithm.setWinrate(percentage);
        console.log(`⚙️  Winrate updated to ${percentage}%`);
    }
}

module.exports = RoundManager;

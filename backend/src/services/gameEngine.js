const RoundManager = require('./roundManager');
const Round = require('../models/Round');

class GameEngine {
    constructor(io) {
        this.io = io;
        this.roundManager = new RoundManager();
        this.currentRoundNumber = 0;
        this.timer = null;
        this.isRunning = false;
    }

    /**
     * Start game engine
     */
    async start() {
        console.log('🎮 Starting Game Engine...');

        // Initialize round manager
        const lastRoundNumber = await this.roundManager.initialize();
        this.currentRoundNumber = lastRoundNumber;

        this.isRunning = true;

        // Start first round
        this.startRound();

        console.log('✅ Game Engine started successfully');
    }

    /**
     * Stop game engine
     */
    stop() {
        console.log('⚠️  Stopping Game Engine...');
        this.isRunning = false;
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    /**
     * Start a new round
     */
    async startRound() {
        if (!this.isRunning) return;

        this.currentRoundNumber++;
        
        // Start new round in manager
        const round = await this.roundManager.startNewRound(this.currentRoundNumber);

        // Broadcast to all clients
        this.io.emit('round_start', {
            roundNumber: round.roundNumber,
            status: 'open',
            timeLeft: 15
        });

        // Start timer
        let timeLeft = 15;
        this.timer = setInterval(async () => {
            timeLeft--;

            // Broadcast timer update
            this.io.emit('timer_update', { timeLeft });

            // At 0 seconds: Lock betting
            if (timeLeft === 0) {
                this.roundManager.lockBetting();
                this.io.emit('betting_locked', {});
            }

            // At -5 seconds: Process round and show results
            if (timeLeft === -5) {
                clearInterval(this.timer);
                
                // Start dice rolling animation
                this.io.emit('dice_rolling', {});

                // Wait for animation
                setTimeout(async () => {
                    // Process round
                    const result = await this.roundManager.processRound();

                    // Broadcast result
                    this.io.emit('round_result', {
                        roundNumber: result.roundNumber,
                        dice1: result.dice1,
                        dice2: result.dice2,
                        dice3: result.dice3,
                        total: result.total,
                        result: result.result
                    });

                    // Update all user balances
                    this.io.emit('balance_update_all', {});

                    // Wait 3 seconds before next round
                    setTimeout(() => {
                        if (this.isRunning) {
                            this.startRound();
                        }
                    }, 3000);
                }, 2000); // 2 second dice animation
            }
        }, 1000);
    }

    /**
     * Handle user bet
     */
    async handleBet(userId, side, amount, callback) {
        try {
            const result = await this.roundManager.placeBet(userId, side, amount);
            
            // Broadcast bet to all users
            this.io.emit('bet_placed', {
                userId,
                side,
                amount
            });

            callback({ success: true, data: result });
        } catch (error) {
            console.error('Bet error:', error.message);
            callback({ success: false, error: error.message });
        }
    }

    /**
     * Get current round info
     */
    getCurrentRound() {
        return this.roundManager.getCurrentRound();
    }

    /**
     * Update winrate (admin)
     */
    async updateWinrate(percentage) {
        await this.roundManager.updateWinrate(percentage);
    }
}

module.exports = GameEngine;

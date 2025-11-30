/**
 * Dice Algorithm - Weighted System for House Edge
 * 
 * This algorithm controls the game outcome to maintain house winrate
 */

class DiceAlgorithm {
    constructor(winratePercentage = 48) {
        this.winratePercentage = winratePercentage;
    }

    /**
     * Roll dice with weighted algorithm
     * @param {Array} bets - Array of current round bets
     * @returns {Object} - {dice1, dice2, dice3, total, result}
     */
    rollDice(bets = []) {
        const shouldFavorHouse = Math.random() * 100 < this.winratePercentage;

        if (shouldFavorHouse && bets.length > 0) {
            return this.rollWeighted(bets);
        } else {
            return this.rollFair();
        }
    }

    /**
     * Fair random roll
     */
    rollFair() {
        const dice1 = this.randomDice();
        const dice2 = this.randomDice();
        const dice3 = this.randomDice();
        const total = dice1 + dice2 + dice3;
        const result = total >= 11 ? 'tai' : 'xiu';

        return { dice1, dice2, dice3, total, result };
    }

    /**
     * Weighted roll favoring house
     */
    rollWeighted(bets) {
        // Calculate total bets on each side
        const taiTotal = bets
            .filter(bet => bet.side === 'tai')
            .reduce((sum, bet) => sum + bet.amount, 0);
        
        const xiuTotal = bets
            .filter(bet => bet.side === 'xiu')
            .reduce((sum, bet) => sum + bet.amount, 0);

        // Determine which side has more money
        let targetResult;
        if (taiTotal > xiuTotal) {
            targetResult = 'xiu'; // House wants Xiu to win
        } else if (xiuTotal > taiTotal) {
            targetResult = 'tai'; // House wants Tai to win
        } else {
            // Equal bets, random
            return this.rollFair();
        }

        // Generate dice that produce target result
        return this.generateDiceForResult(targetResult);
    }

    /**
     * Generate dice combination for specific result
     */
    generateDiceForResult(targetResult) {
        let total;
        
        if (targetResult === 'tai') {
            // Tai: total >= 11 (11-18)
            total = Math.floor(Math.random() * 8) + 11; // 11 to 18
        } else {
            // Xiu: total < 11 (3-10)
            total = Math.floor(Math.random() * 8) + 3; // 3 to 10
        }

        // Generate realistic dice combination
        const dice = this.generateDiceCombination(total);
        
        return {
            dice1: dice[0],
            dice2: dice[1],
            dice3: dice[2],
            total,
            result: targetResult
        };
    }

    /**
     * Generate realistic dice combination for a target total
     */
    generateDiceCombination(targetTotal) {
        const combinations = this.getAllCombinations(targetTotal);
        const randomIndex = Math.floor(Math.random() * combinations.length);
        return combinations[randomIndex];
    }

    /**
     * Get all possible dice combinations for a total
     */
    getAllCombinations(total) {
        const combinations = [];
        
        for (let d1 = 1; d1 <= 6; d1++) {
            for (let d2 = 1; d2 <= 6; d2++) {
                for (let d3 = 1; d3 <= 6; d3++) {
                    if (d1 + d2 + d3 === total) {
                        combinations.push([d1, d2, d3]);
                    }
                }
            }
        }
        
        return combinations;
    }

    /**
     * Roll a single dice (1-6)
     */
    randomDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    /**
     * Update winrate percentage
     */
    setWinrate(percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new Error('Winrate must be between 0 and 100');
        }
        this.winratePercentage = percentage;
    }

    /**
     * Get current winrate
     */
    getWinrate() {
        return this.winratePercentage;
    }
}

module.exports = DiceAlgorithm;

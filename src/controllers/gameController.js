const User = require('../models/User');
const Round = require('../models/Round');
const Bet = require('../models/Bet');
const { asyncHandler } = require('../utils/errorHandler');
const { validateBetAmount, validateBetSide } = require('../utils/validation');

// Game engine instance (will be set from server.js)
let gameEngine = null;

const setGameEngine = (engine) => {
    gameEngine = engine;
};

// @desc    Place bet
// @route   POST /api/game/bet
// @access  Private
const placeBet = asyncHandler(async (req, res) => {
    const { side, amount } = req.body;

    // Validate bet side
    const sideValidation = validateBetSide(side);
    if (!sideValidation.valid) {
        return res.status(400).json({
            success: false,
            error: sideValidation.error
        });
    }

    // Get user balance
    const user = await User.findById(req.user.id);
    const userBalance = user.coins;

    // Validate bet amount
    const amountValidation = validateBetAmount(amount, userBalance);
    if (!amountValidation.valid) {
        return res.status(400).json({
            success: false,
            error: amountValidation.error
        });
    }

    // Check if game engine is available
    if (!gameEngine) {
        return res.status(503).json({
            success: false,
            error: 'Game engine not available'
        });
    }

    // Place bet through game engine
    return new Promise((resolve) => {
        gameEngine.handleBet(req.user.id, side, amount, (result) => {
            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
            resolve();
        });
    });
});

// @desc    Get current round
// @route   GET /api/game/round/current
// @access  Public
const getCurrentRound = asyncHandler(async (req, res) => {
    if (!gameEngine) {
        return res.status(503).json({
            success: false,
            error: 'Game engine not available'
        });
    }

    const currentRound = gameEngine.getCurrentRound();

    res.status(200).json({
        success: true,
        data: currentRound
    });
});

// @desc    Get round result
// @route   GET /api/game/result/:roundId
// @access  Public
const getRoundResult = asyncHandler(async (req, res) => {
    const { roundId } = req.params;

    const round = await Round.findById(roundId);

    if (!round) {
        return res.status(404).json({
            success: false,
            error: 'Round not found'
        });
    }

    // Get bets for this round
    const bets = await Bet.getByRound(roundId);

    res.status(200).json({
        success: true,
        data: {
            round,
            bets
        }
    });
});

// @desc    Get recent rounds
// @route   GET /api/game/rounds/recent
// @access  Public
const getRecentRounds = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    
    const rounds = await Round.getLatest(limit);

    res.status(200).json({
        success: true,
        data: rounds
    });
});

module.exports = {
    setGameEngine,
    placeBet,
    getCurrentRound,
    getRoundResult,
    getRecentRounds
};

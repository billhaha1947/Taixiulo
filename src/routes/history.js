const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../utils/errorHandler');
const Bet = require('../models/Bet');
const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Get user bet history
// @route   GET /api/history/bet
// @access  Private
router.get('/bet', protect, asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const bets = await Bet.getUserHistory(req.user.id, limit, offset);

    res.status(200).json({
        success: true,
        data: bets
    });
}));

// @desc    Get chat history
// @route   GET /api/history/chat
// @access  Public
router.get('/chat', asyncHandler(async (req, res) => {
    const room = req.query.room || 'table';
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const messages = await Chat.getByRoom(room, limit, offset);

    res.status(200).json({
        success: true,
        data: messages
    });
}));

// @desc    Get leaderboard
// @route   GET /api/history/leaderboard
// @access  Public
router.get('/leaderboard', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await User.getLeaderboard(limit);

    res.status(200).json({
        success: true,
        data: leaderboard
    });
}));

module.exports = router;

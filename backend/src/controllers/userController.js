const User = require('../models/User');
const Bet = require('../models/Bet');
const { asyncHandler } = require('../utils/errorHandler');
const { sanitizeInput } = require('../utils/validation');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    // Get user stats
    const stats = await Bet.getUserStats(user.id);

    res.status(200).json({
        success: true,
        data: {
            id: user.id,
            username: user.username,
            coins: user.coins,
            avatar: user.avatar,
            is_admin: user.is_admin,
            created_at: user.created_at,
            stats: stats || {
                total_bets: 0,
                wins: 0,
                losses: 0,
                total_wagered: 0,
                net_profit: 0
            }
        }
    });
});

// @desc    Update avatar
// @route   POST /api/user/avatar
// @access  Private
const updateAvatar = asyncHandler(async (req, res) => {
    const { avatar } = req.body;

    if (!avatar) {
        return res.status(400).json({
            success: false,
            error: 'Avatar URL is required'
        });
    }

    const cleanAvatar = sanitizeInput(avatar);

    // Update avatar
    await User.updateAvatar(req.user.id, cleanAvatar);

    res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        data: { avatar: cleanAvatar }
    });
});

// @desc    Get user balance
// @route   GET /api/user/balance
// @access  Private
const getBalance = asyncHandler(async (req, res) => {
    const balance = await User.getBalance(req.user.id);

    res.status(200).json({
        success: true,
        data: { coins: balance }
    });
});

module.exports = {
    getProfile,
    updateAvatar,
    getBalance
};

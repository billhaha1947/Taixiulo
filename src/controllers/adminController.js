const User = require('../models/User');
const Bet = require('../models/Bet');
const Chat = require('../models/Chat');
const AdminSettings = require('../models/AdminSettings');
const { asyncHandler } = require('../utils/errorHandler');

// Game engine instance
let gameEngine = null;

const setGameEngine = (engine) => {
    gameEngine = engine;
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const users = await User.getAllUsers(limit, offset);

    res.status(200).json({
        success: true,
        data: users
    });
});

// @desc    Ban user
// @route   POST /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { banned } = req.body; // true or false

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    // Prevent banning admin
    if (user.is_admin) {
        return res.status(400).json({
            success: false,
            error: 'Cannot ban admin user'
        });
    }

    if (banned) {
        await User.banUser(id);
    } else {
        await User.unbanUser(id);
    }

    res.status(200).json({
        success: true,
        message: `User ${banned ? 'banned' : 'unbanned'} successfully`
    });
});

// @desc    Update user coins
// @route   POST /api/admin/users/:id/coins
// @access  Private/Admin
const updateUserCoins = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { coins } = req.body;

    if (typeof coins !== 'number' || coins < 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid coins amount'
        });
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    await User.updateCoins(id, coins);

    res.status(200).json({
        success: true,
        message: 'User coins updated successfully',
        data: { coins }
    });
});

// @desc    Update winrate
// @route   POST /api/admin/winrate
// @access  Private/Admin
const updateWinrate = asyncHandler(async (req, res) => {
    const { winrate } = req.body;

    if (typeof winrate !== 'number' || winrate < 0 || winrate > 100) {
        return res.status(400).json({
            success: false,
            error: 'Winrate must be between 0 and 100'
        });
    }

    await AdminSettings.setWinrate(winrate);

    // Update game engine winrate
    if (gameEngine) {
        await gameEngine.updateWinrate(winrate);
    }

    res.status(200).json({
        success: true,
        message: 'Winrate updated successfully',
        data: { winrate }
    });
});

// @desc    Get admin settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
    const settings = await AdminSettings.getAll();

    res.status(200).json({
        success: true,
        data: settings
    });
});

// @desc    Reset user password
// @route   POST /api/admin/reset-password
// @access  Private/Admin
const resetPassword = asyncHandler(async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({
            success: false,
            error: 'User ID and new password are required'
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 6 characters'
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    await User.updatePassword(userId, newPassword);

    res.status(200).json({
        success: true,
        message: 'Password reset successfully'
    });
});

// @desc    Get all bets
// @route   GET /api/admin/bets
// @access  Private/Admin
const getAllBets = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const bets = await Bet.getAllBets(limit, offset);

    res.status(200).json({
        success: true,
        data: bets
    });
});

// @desc    Get all chat history
// @route   GET /api/admin/chats
// @access  Private/Admin
const getAllChats = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const chats = await Chat.getAllHistory(limit, offset);

    res.status(200).json({
        success: true,
        data: chats
    });
});

module.exports = {
    setGameEngine,
    getAllUsers,
    banUser,
    updateUserCoins,
    updateWinrate,
    getSettings,
    resetPassword,
    getAllBets,
    getAllChats
};

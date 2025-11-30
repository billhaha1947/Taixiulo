const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    banUser,
    updateUserCoins,
    updateWinrate,
    getSettings,
    resetPassword,
    getAllBets,
    getAllChats
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// All routes require authentication and admin privileges
router.use(protect);
router.use(isAdmin);

// User management
router.get('/users', getAllUsers);
router.post('/users/:id/ban', banUser);
router.post('/users/:id/coins', updateUserCoins);
router.post('/reset-password', resetPassword);

// Game settings
router.get('/settings', getSettings);
router.post('/winrate', updateWinrate);

// Data access
router.get('/bets', getAllBets);
router.get('/chats', getAllChats);

module.exports = router;

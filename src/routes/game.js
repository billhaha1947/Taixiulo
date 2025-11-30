const express = require('express');
const router = express.Router();
const { 
    placeBet, 
    getCurrentRound, 
    getRoundResult,
    getRecentRounds 
} = require('../controllers/gameController');
const { protect } = require('../middleware/auth');
const { betLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/round/current', getCurrentRound);
router.get('/result/:roundId', getRoundResult);
router.get('/rounds/recent', getRecentRounds);

// Protected routes
router.post('/bet', protect, betLimiter, placeBet);

module.exports = router;

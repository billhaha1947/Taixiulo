const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Private routes
router.post('/change-password', protect, changePassword);

module.exports = router;

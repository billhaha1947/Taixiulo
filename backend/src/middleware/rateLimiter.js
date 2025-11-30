const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    skipSuccessfulRequests: true,
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.'
    }
});

// Betting rate limiter
const betLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 5, // 5 bets per second
    message: {
        success: false,
        error: 'Slow down! Too many bets.'
    }
});

// Chat rate limiter
const chatLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 5, // 5 messages per 10 seconds
    message: {
        success: false,
        error: 'Slow down! You are sending messages too quickly.'
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    betLimiter,
    chatLimiter
};

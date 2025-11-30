const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dragon_fire_casino_secret_key';

// Protect routes - require authentication
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, no token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Get user from database
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Check if user is banned
            if (user.banned) {
                return res.status(403).json({
                    success: false,
                    error: 'Account is banned'
                });
            }

            // Attach user to request
            req.user = user;
            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Server error during authentication'
        });
    }
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

module.exports = {
    protect,
    generateToken
};

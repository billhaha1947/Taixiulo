const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validateUsername, validatePassword, sanitizeInput } = require('../utils/validation');
const { asyncHandler } = require('../utils/errorHandler');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Sanitize inputs
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = sanitizeInput(password);

    // Validate username
    const usernameValidation = validateUsername(cleanUsername);
    if (!usernameValidation.valid) {
        return res.status(400).json({
            success: false,
            error: usernameValidation.error
        });
    }

    // Validate password
    const passwordValidation = validatePassword(cleanPassword);
    if (!passwordValidation.valid) {
        return res.status(400).json({
            success: false,
            error: passwordValidation.error
        });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(cleanUsername);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: 'Username already exists'
        });
    }

    // Create user
    const userId = await User.create(cleanUsername, cleanPassword);
    const user = await User.findById(userId);

    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
        success: true,
        data: {
            user: {
                id: user.id,
                username: user.username,
                coins: user.coins,
                avatar: user.avatar
            },
            token
        }
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Sanitize inputs
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = sanitizeInput(password);

    // Validate inputs
    if (!cleanUsername || !cleanPassword) {
        return res.status(400).json({
            success: false,
            error: 'Please provide username and password'
        });
    }

    // Find user
    const user = await User.findByUsername(cleanUsername);
    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    // Check if banned
    if (user.banned) {
        return res.status(403).json({
            success: false,
            error: 'Account is banned'
        });
    }

    // Verify password
    const isMatch = await User.verifyPassword(cleanPassword, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
        success: true,
        data: {
            user: {
                id: user.id,
                username: user.username,
                coins: user.coins,
                avatar: user.avatar,
                is_admin: user.is_admin
            },
            token
        }
    });
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Sanitize inputs
    const cleanCurrent = sanitizeInput(currentPassword);
    const cleanNew = sanitizeInput(newPassword);

    // Validate new password
    const passwordValidation = validatePassword(cleanNew);
    if (!passwordValidation.valid) {
        return res.status(400).json({
            success: false,
            error: passwordValidation.error
        });
    }

    // Get user with password hash
    const user = await User.findByUsername(req.user.username);

    // Verify current password
    const isMatch = await User.verifyPassword(cleanCurrent, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Current password is incorrect'
        });
    }

    // Update password
    await User.updatePassword(req.user.id, cleanNew);

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

module.exports = {
    register,
    login,
    changePassword
};

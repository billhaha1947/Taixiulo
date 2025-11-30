// Validation utilities

// Validate username
const validateUsername = (username) => {
    if (!username || typeof username !== 'string') {
        return { valid: false, error: 'Username is required' };
    }

    if (username.length < 3 || username.length > 20) {
        return { valid: false, error: 'Username must be between 3 and 20 characters' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }

    return { valid: true };
};

// Validate password
const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters' };
    }

    return { valid: true };
};

// Validate bet amount
const validateBetAmount = (amount, userBalance) => {
    if (!amount || typeof amount !== 'number') {
        return { valid: false, error: 'Invalid bet amount' };
    }

    if (amount <= 0) {
        return { valid: false, error: 'Bet amount must be greater than 0' };
    }

    if (amount > userBalance) {
        return { valid: false, error: 'Insufficient balance' };
    }

    if (!Number.isInteger(amount)) {
        return { valid: false, error: 'Bet amount must be a whole number' };
    }

    return { valid: true };
};

// Validate bet side
const validateBetSide = (side) => {
    if (!side || !['tai', 'xiu'].includes(side)) {
        return { valid: false, error: 'Invalid bet side. Must be "tai" or "xiu"' };
    }

    return { valid: true };
};

// Validate chat message
const validateChatMessage = (message) => {
    if (!message || typeof message !== 'string') {
        return { valid: false, error: 'Message is required' };
    }

    if (message.trim().length === 0) {
        return { valid: false, error: 'Message cannot be empty' };
    }

    if (message.length > 200) {
        return { valid: false, error: 'Message is too long (max 200 characters)' };
    }

    // Check for spam patterns
    if (/(.)\1{4,}/.test(message)) {
        return { valid: false, error: 'Message contains too many repeated characters' };
    }

    return { valid: true };
};

// Validate chat room
const validateChatRoom = (room) => {
    if (!room || !['table', 'global'].includes(room)) {
        return { valid: false, error: 'Invalid chat room. Must be "table" or "global"' };
    }

    return { valid: true };
};

// Sanitize input
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .substring(0, 500); // Limit length
};

module.exports = {
    validateUsername,
    validatePassword,
    validateBetAmount,
    validateBetSide,
    validateChatMessage,
    validateChatRoom,
    sanitizeInput
};

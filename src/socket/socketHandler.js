const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');
const { validateChatMessage, validateChatRoom, sanitizeInput } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'dragon_fire_casino_secret_key';

let gameEngine = null;

/**
 * Initialize Socket.IO
 */
function initializeSocketIO(server) {
    const io = socketIO(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Middleware for socket authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Get user from database
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            if (user.banned) {
                return next(new Error('Authentication error: Account is banned'));
            }

            // Attach user to socket
            socket.user = user;
            next();

        } catch (error) {
            console.error('Socket auth error:', error.message);
            next(new Error('Authentication error'));
        }
    });

    // Connection handler
    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.user.username} (${socket.id})`);

        // Send user info
        socket.emit('user_connected', {
            username: socket.user.username,
            coins: socket.user.coins,
            avatar: socket.user.avatar
        });

        // Join game room
        socket.on('join_game', () => {
            socket.join('game_room');
            console.log(`🎮 ${socket.user.username} joined game room`);

            // Send current round info
            if (gameEngine) {
                const currentRound = gameEngine.getCurrentRound();
                socket.emit('current_round', currentRound);
            }
        });

        // Handle chat messages
        socket.on('send_chat', async (data) => {
            try {
                const { message, room } = data;

                // Validate room
                const roomValidation = validateChatRoom(room);
                if (!roomValidation.valid) {
                    socket.emit('chat_error', { error: roomValidation.error });
                    return;
                }

                // Validate message
                const cleanMessage = sanitizeInput(message);
                const messageValidation = validateChatMessage(cleanMessage);
                if (!messageValidation.valid) {
                    socket.emit('chat_error', { error: messageValidation.error });
                    return;
                }

                // Check spam
                const recentCount = await Chat.getUserRecentMessages(socket.user.id, 10);
                if (recentCount >= 5) {
                    socket.emit('chat_error', { error: 'You are sending messages too quickly' });
                    return;
                }

                // Get current round number
                const currentRound = gameEngine ? gameEngine.getCurrentRound() : null;
                const roundId = currentRound ? currentRound.roundNumber : null;

                // Save chat message
                await Chat.create(socket.user.id, roundId, room, cleanMessage);

                // Broadcast to all users in the room
                const chatData = {
                    username: socket.user.username,
                    avatar: socket.user.avatar,
                    message: cleanMessage,
                    room,
                    timestamp: new Date().toISOString()
                };

                io.emit('chat_message', chatData);
                console.log(`💬 ${socket.user.username} in ${room}: ${cleanMessage}`);

            } catch (error) {
                console.error('Chat error:', error.message);
                socket.emit('chat_error', { error: 'Failed to send message' });
            }
        });

        // Handle bet placement
        socket.on('place_bet', async (data) => {
            try {
                const { side, amount } = data;

                if (!gameEngine) {
                    socket.emit('bet_error', { error: 'Game engine not available' });
                    return;
                }

                // Place bet through game engine
                gameEngine.handleBet(socket.user.id, side, amount, async (result) => {
                    if (result.success) {
                        // Update user's balance
                        const updatedUser = await User.findById(socket.user.id);
                        socket.user.coins = updatedUser.coins;

                        socket.emit('bet_success', {
                            side,
                            amount,
                            newBalance: updatedUser.coins
                        });

                        // Broadcast bet to all users
                        io.emit('bet_placed', {
                            username: socket.user.username,
                            side,
                            amount
                        });

                        console.log(`💰 ${socket.user.username} bet ${amount} on ${side}`);
                    } else {
                        socket.emit('bet_error', { error: result.error });
                    }
                });

            } catch (error) {
                console.error('Bet error:', error.message);
                socket.emit('bet_error', { error: 'Failed to place bet' });
            }
        });

        // Request balance update
        socket.on('request_balance', async () => {
            try {
                const user = await User.findById(socket.user.id);
                socket.emit('balance_update', { coins: user.coins });
            } catch (error) {
                console.error('Balance request error:', error.message);
            }
        });

        // Disconnect handler
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.user.username} (${socket.id})`);
        });
    });

    console.log('✅ Socket.IO initialized');

    return io;
}

/**
 * Set game engine instance
 */
function setGameEngine(engine) {
    gameEngine = engine;
}

module.exports = {
    initializeSocketIO,
    setGameEngine
};

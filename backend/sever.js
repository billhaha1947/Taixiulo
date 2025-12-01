require('dotenv').config();
const app = require('./src/app');
const { initializeDatabase } = require('./src/config/database');
const { initializeSocketIO, setGameEngine: setSocketGameEngine } = require('./src/socket/socketHandler');
const GameEngine = require('./src/services/gameEngine');
const { setGameEngine: setGameControllerEngine } = require('./src/controllers/gameController');
const { setGameEngine: setAdminControllerEngine } = require('./src/controllers/adminController');

const PORT = process.env.PORT || 5000;

/**
 * Start server
 */
async function startServer() {
    try {
        console.log('');
        console.log('═══════════════════════════════════════════════');
        console.log('🐉 Dragon Fire Casino Backend Server');
        console.log('═══════════════════════════════════════════════');
        console.log('');

        // Step 1: Initialize database
        console.log('📦 Step 1: Initializing database...');
        await initializeDatabase();
        console.log('');

        // Step 2: Start HTTP server
        console.log('🌐 Step 2: Starting HTTP server...');
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   URL: http://localhost:${PORT}`);
        });
        console.log('');

        // Step 3: Initialize Socket.IO
        console.log('🔌 Step 3: Initializing Socket.IO...');
        const io = initializeSocketIO(server);
        console.log('');

        // Step 4: Start Game Engine
        console.log('🎮 Step 4: Starting Game Engine...');
        const gameEngine = new GameEngine(io);
        await gameEngine.start();
        console.log('');

        // Step 5: Set game engine to handlers
        console.log('⚙️  Step 5: Connecting components...');
        setSocketGameEngine(gameEngine);
        setGameControllerEngine(gameEngine);
        setAdminControllerEngine(gameEngine);
        console.log('✅ All components connected');
        console.log('');

        console.log('═══════════════════════════════════════════════');
        console.log('✨ Dragon Fire Casino is now LIVE!');
        console.log('═══════════════════════════════════════════════');
        console.log('');
        console.log('📋 Available endpoints:');
        console.log('   • Health check: GET /health');
        console.log('   • Auth:         POST /api/auth/register');
        console.log('   •               POST /api/auth/login');
        console.log('   • Game:         POST /api/game/bet');
        console.log('   •               GET  /api/game/round/current');
        console.log('   • User:         GET  /api/user/profile');
        console.log('   • Admin:        GET  /api/admin/users');
        console.log('   • History:      GET  /api/history/leaderboard');
        console.log('');
        console.log('🔐 Default admin account:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('');
        console.log('⚠️  Remember to change admin password!');
        console.log('');

        // Graceful shutdown
        const gracefulShutdown = () => {
            console.log('');
            console.log('⚠️  Shutting down gracefully...');
            gameEngine.stop();
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error('');
        console.error('═══════════════════════════════════════════════');
        console.error('❌ Failed to start server');
        console.error('═══════════════════════════════════════════════');
        console.error('Error:', error);
        console.error('');
        process.exit(1);
    }
}

// Start the server
startServer();

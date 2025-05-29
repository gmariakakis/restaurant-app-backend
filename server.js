console.log('\n📦 Starting Book API...\n');

let config;
let logger;
let app;
let server;

// Load Config
console.log('⚙️  Loading configuration...');
try {
    config = require('./src/config');
    console.log('✅ Config loaded');
} catch (err) {
    console.error('❌ Failed to load config:', err);
    process.exit(1);
}

// Load Logger
console.log('📝 Loading logger...');
try {
    logger = require('./src/utils/logger');
    console.log('✅ Logger loaded');
} catch (err) {
    console.error('❌ Failed to load logger:', err);
    process.exit(1);
}

// Load Express App
console.log('🚀 Loading Express app...');
try {
    app = require('./src/app');
    console.log('✅ Express app loaded');
} catch (err) {
    console.error('❌ Failed to load app:', err);
    process.exit(1);
}

// Start Server
const { port, env } = config.app;

try {
    server = app.listen(port, () => {
        logger.info(`🌐 App ready at: http://localhost:${port}`);
        logger.info(`🌍 Environment: ${env}`);
    });
} catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
}

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('\n🛑 SIGINT received. Shutting down server gracefully...');
    server.close(() => {
        logger.info('💤 Server closed. Goodbye!\n');
        process.exit(0);
    });
});

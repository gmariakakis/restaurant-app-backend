const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

let routes;
let config;
let app;

console.log('\n📁 Bootstrapping Express Application...\n');

// Load Routes
console.log('🔍 Loading routes...');
try {
    routes = require('./routes');
    console.log('✅ Routes loaded successfully');
} catch (err) {
    console.error('❌ Failed to load routes:', err);
}

// Load Config
console.log('⚙️  Loading config...');
try {
    config = require('./config');
    console.log('✅ Config loaded');
} catch (err) {
    console.error('❌ Failed to load config:', err);
}

// Initialize Express
console.log('🚀 Initializing Express app...');
try {
    app = express();

    // Middleware
    app.use(express.json());
    const corsOptions = require('./config/cors');
    app.use('/api', cors(corsOptions));
    app.use(helmet());
    if (config.app.env === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined', { stream: logger.stream }));
    }

    // Health check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', environment: config.app.env });
    });

    // Swagger
    if (config.swagger.enabled) {
        console.log('📚 Loading Swagger for development/staging...');
        try {
            app.use('/api-docs', (req, res, next) => {
                res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
                next();
            });

            const swaggerUi = require('swagger-ui-express');
            const swaggerSpec = require('./config/swagger');

            // Serve raw JSON
            app.get('/swagger.json', (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(swaggerSpec);
            });

            // Use swaggerUrl instead of passing spec directly
            app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

            logger.info(`📖 Swagger UI: http://localhost:${config.app.port}/api-docs`);
        } catch (err) {
            console.error('❌ Failed to load Swagger modules:', err);
        }
    }

    // Routes
    app.use('/api', routes);

    // Error Handling
    app.use(notFoundHandler);
    app.use(errorHandler);

    console.log('✅ Express app initialized');
} catch (err) {
    console.error('❌ Failed to initialize Express app:', err);
}

module.exports = app;

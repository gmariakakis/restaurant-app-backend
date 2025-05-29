const logger = require('../utils/logger');

/**
 * Global error-handling middleware.
 * Logs the error and returns a generic 500 response.
 */
const errorHandler = (err, req, res, next) => {
    logger.error('Unhandled Error:', err);

    res.status(500).json({
        message: 'Internal Server Error. Please try again later.',
        error: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
};

/**
 * Fallback route handler for 404 errors.
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
};

module.exports = {
    errorHandler,
    notFoundHandler
};

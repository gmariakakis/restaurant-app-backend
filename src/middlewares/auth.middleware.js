const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate requests using JWT.
 * Validates the Authorization header and decodes the token.
 * Provides detailed error handling for common JWT issues.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        logger.warn('Unauthorized access: No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
        if (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    logger.warn('Unauthorized: Token expired');
                    return res.status(401).json({ message: 'Unauthorized: Token has expired. Please log in again.' });
                case 'JsonWebTokenError':
                    logger.warn('Forbidden: Invalid token');
                    return res.status(403).json({ message: 'Forbidden: Invalid token' });
                case 'NotBeforeError':
                    logger.warn('Forbidden: Token not yet valid');
                    return res.status(403).json({ message: 'Forbidden: Token is not yet valid' });
                default:
                    logger.error('JWT Verification Error', err);
                    return res.status(500).json({ message: 'Server error. Please try again later.' });
            }
        }

        req.user = {
               id:       decoded.id,
               uuid:     decoded.uuid,
               username: decoded.username,
               email:    decoded.email,
               role:     decoded.role
         };
        next();
    });
};

module.exports = { authenticateToken };

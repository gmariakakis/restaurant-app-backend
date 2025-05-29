const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
        return stack
            ? `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`
            : `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
);

// Define transports
const logger = createLogger({
    level: 'info', // Default level, change per environment
    format: logFormat,
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), logFormat),
            handleExceptions: true
        }),
        new transports.File({
            filename: path.join(logDir, 'app.log'),
            handleExceptions: true
        })
    ],
    exitOnError: false
});

// Stream for morgan (HTTP request logging)
logger.stream = {
    write: (message) => logger.info(message.trim())
};

module.exports = logger;

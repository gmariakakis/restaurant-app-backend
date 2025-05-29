module.exports = {
    app: {
        env: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT, 10) || 3000
    },
    db: {
        host: process.env.DB_HOST || 'ipv4.kosmidis.me',
        port: parseInt(process.env.DB_PORT, 10) || 33066,
        user: process.env.DB_USER || 'gmariakakis22b',
        password: process.env.DB_PASSWORD || 'dc307208',
        database: process.env.DB_NAME || 'gmariakakis22b_db2'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'devSuperSecretKey',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    },
    swagger: {
        enabled: process.env.ENABLE_SWAGGER === 'true'
    },
    logger: {
        level: process.env.LOG_LEVEL || 'debug'
    },
    cors: {
        origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim())
    }
};

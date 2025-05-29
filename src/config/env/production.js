module.exports = {
    app: {
        env: process.env.NODE_ENV || 'production',
        port: parseInt(process.env.PORT, 10) || 80
    },
    db: {
        host: process.env.DB_HOST || 'my.superdomain.eu',
        port: parseInt(process.env.DB_PORT, 10) || 32788,
        user: process.env.DB_USER || 'prod_user',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'gmariakakis22b_db2'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'ReplaceThisWithASecretKey',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    swagger: {
        enabled: process.env.ENABLE_SWAGGER === 'true'
    },
    logger: {
        level: process.env.LOG_LEVEL || 'debug'
    },
    cors: {
        origins: (process.env.ALLOWED_ORIGINS || 'http://my.superdomain.eu').split(',').map(s => s.trim())
    }
};

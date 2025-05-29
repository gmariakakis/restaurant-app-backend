const config = require('./index');

module.exports = {
    secret: config.jwt.secret,
    options: {
        expiresIn: config.jwt.expiresIn
    }
};

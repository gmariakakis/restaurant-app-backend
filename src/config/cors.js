const config = require('./index');

// CORS options
module.exports = {
    origin: config.cors.origins || '*', // or use ['http://localhost:3000'] for stricter config
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

// setup.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app = require('../../src/app');

module.exports = app;

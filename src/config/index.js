const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Determine current environment
const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, `../../.env.${env}`);

// Load .env file if it exists
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`✅ Environment variables loaded from ${envFile}`);
} else {
    console.warn(`⚠️ No .env file found for environment "${env}"`);
}

// Base config
const baseConfig = {
    app: {
        env,
        port: process.env.PORT || 3000
    }
};

// Load environment-specific overrides
const envConfig = require(`./env/${env}.js`);

module.exports = {
    ...baseConfig,
    ...envConfig
};

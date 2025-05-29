const logger = require('./logger');

/**
 * Simulates sending an email verification message.
 * Replace this mock with real Brevo integration in production.
 * @param {string} email - The user's email address
 * @param {string} token - The email verification token
 */
const sendEmailVerification = async (email, token) => {
    const verifyUrl = `https://yourdomain.com/api/verify-email?token=${token}`;
    logger.info(`[Mock Email] Sending verification email to ${email}`);
    logger.info(`[Mock Email] Verification link: ${verifyUrl}`);
    console.log(`✅ [MOCK] Verification email sent to ${email}: ${verifyUrl}`);
};

/**
 * Simulates sending a password reset email.
 * Replace this mock with real Brevo integration in production.
 * @param {string} email - The user's email address
 * @param {string} token - The reset token
 */
const sendPasswordReset = async (email, token) => {
    const resetUrl = `https://yourdomain.com/reset-password?token=${token}`;
    logger.info(`[Mock Email] Sending password reset email to ${email}`);
    logger.info(`[Mock Email] Reset link: ${resetUrl}`);
    console.log(`✅ [MOCK] Password reset email sent to ${email}: ${resetUrl}`);
};

module.exports = {
    sendEmailVerification,
    sendPasswordReset
};

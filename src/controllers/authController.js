/* const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

/**
 * Authenticate user and generate JWT token.
 */
/*const login = (req, res) => {
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: 'Username is required and must be a string.' });
    }

    const user = { name: username };
    const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ accessToken });
};

module.exports = { login };

*/








const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const AccountModel = require('../models/account.model');
const config = require('../config');
const logger = require('../utils/logger');
const mailer = require('../utils/mailer');

const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRATION = config.jwt.expiresIn;
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET || 'emailSecret';
const PASSWORD_RESET_SECRET = process.env.RESET_TOKEN_SECRET || 'resetSecret';

// Generate access token
const generateAccessToken = (user) => {
    const payload = {
        id:       user.id,
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        role: user.role,
        tokenVersion: user.token_version
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Register
const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        const existing = await AccountModel.getAccountByEmail(email);
        if (existing) return res.status(409).json({ message: 'Email is already registered.' });

        const uuid = uuidv4();
        const password_hash = await bcrypt.hash(password, 12);

        await AccountModel.createAccount({
            uuid,
            username,
            email,
            password_hash,
            role: 'user'
        });

        const emailToken = jwt.sign({ uuid }, EMAIL_TOKEN_SECRET, { expiresIn: '1d' });
        await mailer.sendEmailVerification(email, emailToken);

        return res.status(201).json({ message: 'Account created. Please verify your email.' });
    } catch (err) {
        logger.error('Registration error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Verify email
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const { uuid } = jwt.verify(token, EMAIL_TOKEN_SECRET);
        const user = await AccountModel.getAccountById(uuid);
        if (!user) return res.status(404).json({ message: 'Invalid verification token.' });

        if (user.email_verified) {
            return res.status(409).json({ message: 'Email already verified.' });
        }

        await AccountModel.updateAccount(uuid, {
            ...user,
            email_verified: true
        });

        return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (err) {
        logger.error('Email verification error:', err);
        return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
};

// Resend verification
const resendVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    try {
        const user = await AccountModel.getAccountByEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (user.email_verified) {
            return res.status(409).json({ message: 'Email is already verified.' });
        }

        const token = jwt.sign({ uuid: user.uuid }, EMAIL_TOKEN_SECRET, { expiresIn: '1d' });
        await mailer.sendEmailVerification(email, token);

        return res.status(200).json({ message: 'Verification email sent.' });
    } catch (err) {
        logger.error('Resend verification error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await AccountModel.getAccountByEmail(email);
        if (!user || !user.is_active) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (!user.email_verified) {
            return res.status(403).json({ message: 'Email not verified.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign({ uuid: user.uuid, version: user.token_version }, JWT_SECRET, { expiresIn: '7d' });

        await AccountModel.setRefreshToken(user.uuid, refreshToken);
        await AccountModel.updateLastLogin(user.uuid);

        return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        logger.error('Login error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required.' });

    try {
        const payload = jwt.verify(refreshToken, JWT_SECRET);
        const user = await AccountModel.getAccountById(payload.uuid);

        if (!user || user.token_version !== payload.version) {
            return res.status(401).json({ message: 'Refresh token is invalid or expired.' });
        }

        const accessToken = generateAccessToken(user);
        return res.status(200).json({ accessToken });
    } catch (err) {
        logger.error('Refresh token error:', err);
        return res.status(401).json({ message: 'Invalid refresh token.' });
    }
};

// Logout
const logout = async (req, res) => {
    try {
        const uuid = req.user.uuid;
        await AccountModel.incrementTokenVersion(uuid); // invalidates old refresh tokens
        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        logger.error('Logout error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    try {
        const user = await AccountModel.getAccountByEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const token = jwt.sign({ uuid: user.uuid }, PASSWORD_RESET_SECRET, { expiresIn: '1h' });
        await mailer.sendPasswordReset(email, token);

        return res.status(200).json({ message: 'Password reset email sent.' });
    } catch (err) {
        logger.error('Forgot password error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    try {
        const { uuid } = jwt.verify(token, PASSWORD_RESET_SECRET);
        const hash = await bcrypt.hash(newPassword, 12);
        await AccountModel.updatePassword(uuid, hash);

        return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        logger.error('Reset password error:', err);
        return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
};

module.exports = {
    register,
    verifyEmail,
    resendVerification,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword
};


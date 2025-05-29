/*const express = require('express');
const { login } = require('../controllers/authController'); // Ensure correct path

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     description: Returns a JWT token for accessing protected routes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testuser"
 *     responses:
 *       200:
 *         description: JWT token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1..."
 *       400:
 *         description: Bad request - username not provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username required"
 */
/*
router.post('/login', login);

module.exports = router;


*/
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth.middleware');
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     description: Logs a user in using email and password. Returns a JWT token for accessing protected routes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: JWT token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1..."
 *       400:
 *         description: Bad request - missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and password are required."
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password."
 *       403:
 *         description: Account disabled or email not verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email not verified."
 *       500:
 *         description: Internal server error.
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a success message. Requires email confirmation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPassword!123"
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account created. Please verify your email."
 *       400:
 *         description: Bad request - missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username, email, and password are required."
 *       409:
 *         description: Conflict - email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is already registered."
 *       500:
 *         description: Internal server error.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/verify-email:
 *   get:
 *     summary: Verify user email
 *     description: Verifies a user's email address using the provided token.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR..."
 *         description: Email verification token sent to the user’s email address.
 *     responses:
 *       200:
 *         description: Email successfully verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully."
 *       400:
 *         description: Invalid or expired token.
 *       404:
 *         description: Verification token not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/verify-email', authController.verifyEmail);

/**
 * @swagger
 * /api/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     description: Sends a new email verification link to the specified email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent.
 *       400:
 *         description: Missing email.
 *       404:
 *         description: User not found.
 *       409:
 *         description: Email already verified.
 *       500:
 *         description: Internal server error.
 */
router.post('/resend-verification', authController.resendVerification);

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent.
 *       400:
 *         description: Missing email.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user’s password using a token from their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR..."
 *               newPassword:
 *                 type: string
 *                 example: "NewSecurePass123!"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Missing or invalid token/password.
 *       404:
 *         description: Token not found or expired.
 *       500:
 *         description: Internal server error.
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Provides a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR..."
 *     responses:
 *       200:
 *         description: New access token issued.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1..."
 *       400:
 *         description: Invalid or missing refresh token.
 *       401:
 *         description: Refresh token expired or revoked.
 *       500:
 *         description: Internal server error.
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the user by invalidating the current refresh token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out.
 *       401:
 *         description: Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;

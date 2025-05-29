const db = require('../config/database');

const AccountModel = {
    /**
     * Fetch all accounts with optional pagination
     * @param {number|null} limit
     * @param {number|null} offset
     * @returns {Promise<Array>}
     */
    async getAllAccounts(limit = null, offset = null) {
        let query = 'SELECT uuid, username, email, role, email_verified, is_active, created_at FROM accounts';
        const params = [];

        if (limit !== null) {
            query += ' LIMIT ?';
            params.push(limit);
        }

        if (offset !== null && limit !== null) {
            query += ' OFFSET ?';
            params.push(offset);
        }

        const conn = await db.createConnection();
        const [rows] = await conn.execute(query, params);
        await conn.end();
        return rows;
    },

    /**
     * Get an account by UUID
     * @param {string} uuid
     * @returns {Promise<Object|null>}
     */
    async getAccountById(uuid) {
        const conn = await db.createConnection();
        const [rows] = await conn.execute(
            `SELECT id,uuid, username, email, role, password_hash, email_verified, is_active, created_at, token_version
             FROM accounts WHERE uuid = ?`,
            [uuid]
        );
        await conn.end();
        return rows.length ? rows[0] : null;
    },
    /**
     * Get an account by UUID
     * @param {string} uuid
     * @returns {Promise<Object|null>}
     */
    async getByUuid(uuid) {
        const conn = await db.createConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM accounts WHERE uuid = ?',
            [uuid]
        );
        await conn.end();
        return rows[0];   // user.id υπάρχει εδώ
    },
    /**
     * Get an account by email
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    async getAccountByEmail(email) {
        const conn = await db.createConnection();
        const [rows] = await conn.execute(
            `SELECT id,uuid, username, email, role, password_hash, email_verified, is_active, created_at, token_version
             FROM accounts WHERE email = ?`,
            [email]
        );
        await conn.end();
        return rows.length ? rows[0] : null;
    },

    /**
     * Create a new account
     * @param {Object} accountData
     * @param {string} accountData.uuid
     * @param {string} accountData.username
     * @param {string} accountData.email
     * @param {string} accountData.password_hash
     * @param {string} accountData.role
     * @returns {Promise<void>}
     */
    async createAccount({ uuid, username, email, password_hash, role }) {
        const conn = await db.createConnection();
        await conn.execute(
            'INSERT INTO accounts (uuid, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [uuid, username, email, password_hash, role]
        );
        await conn.end();
    },

    /**
     * Update account details (excluding password)
     * @param {string} uuid
     * @param {Object} data
     * @param {string} data.username
     * @param {string} data.email
     * @param {string} data.role
     * @param {boolean} data.email_verified
     * @param {boolean} data.is_active
     * @returns {Promise<boolean>}
     */
    async updateAccount(uuid, { username, email, role, email_verified, is_active }) {
        const conn = await db.createConnection();
        const [result] = await conn.execute(
            `UPDATE accounts
             SET username = ?, email = ?, role = ?, email_verified = ?, is_active = ?
             WHERE uuid = ?`,
            [username, email, role, email_verified, is_active, uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Update password
     * @param {string} uuid
     * @param {string} password_hash
     * @returns {Promise<boolean>}
     */
    async updatePassword(uuid, password_hash) {
        const conn = await db.createConnection();
        const [result] = await conn.execute(
            'UPDATE accounts SET password_hash = ? WHERE uuid = ?',
            [password_hash, uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Save refresh token (optional)
     * @param {string} uuid
     * @param {string|null} token
     * @returns {Promise<boolean>}
     */
    async setRefreshToken(uuid, token) {
        const conn = await db.createConnection();
        const [result] = await conn.execute(
            'UPDATE accounts SET refresh_token = ? WHERE uuid = ?',
            [token, uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Increment token version (e.g. logout all sessions)
     * @param {string} uuid
     * @returns {Promise<boolean>}
     */
    async incrementTokenVersion(uuid) {
        const conn = await db.createConnection();
        const [result] = await conn.execute(
            'UPDATE accounts SET token_version = token_version + 1 WHERE uuid = ?',
            [uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Update last login timestamp
     * @param {string} uuid
     * @returns {Promise<boolean>}
     */
    async updateLastLogin(uuid) {
        const conn = await db.createConnection();
        const [result] = await conn.execute(
            'UPDATE accounts SET last_login_at = NOW() WHERE uuid = ?',
            [uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Delete an account
     * @param {string} uuid
     * @returns {Promise<boolean>}
     */
    async deleteAccount(uuid) {
        const conn = await db.createConnection();
        const [result] = await conn.execute('DELETE FROM accounts WHERE uuid = ?', [uuid]);
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Check if an account exists
     * @param {string} uuid
     * @returns {Promise<boolean>}
     */
    async accountExists(uuid) {
        const conn = await db.createConnection();
        const [rows] = await conn.execute('SELECT 1 FROM accounts WHERE uuid = ? LIMIT 1', [uuid]);
        await conn.end();
        return rows.length > 0;
    }
};

module.exports = AccountModel;

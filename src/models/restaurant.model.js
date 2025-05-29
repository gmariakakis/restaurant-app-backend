const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

/**
 * Get a new database connection
 * @returns {Promise<mysql.Connection>}
 */
const getConnection = async () => {
    return mysql.createConnection(dbConfig);
};

const RestaurantModel = {
    /**
     * Fetch all restaurants with optional pagination
     * @param {number|null} limit
     * @param {number|null} offset
     * @returns {Promise<Array>}
     */
    async getAllRestaurants(limit = null, offset = null) {
        let query = 'SELECT * FROM restaurants';
        const params = [];

        if (limit !== null) {
            query += ' LIMIT ?';
            params.push(limit);
        }

        if (offset !== null && limit !== null) {
            query += ' OFFSET ?';
            params.push(offset);
        }

        const conn = await getConnection();
        const [rows] = await conn.execute(query, params);
        await conn.end();
        return rows;
    },

    /**
     * Get a restaurant by its UUID
     * @param {string} restaurant_uuid
     * @returns {Promise<Object|null>}
     */
    async getRestaurantById(uuid) {
        const conn = await getConnection();
        const [rows] = await conn.execute('SELECT * FROM restaurants WHERE uuid = ?', [uuid]);
        await conn.end();
        return rows.length ? rows[0] : null;
    },

    /**
     * Create a new restaurant
     * @param {Object} restaurantData
     * @param {string} restaurantData.restaurant_uuid
     * @param {string} restaurantData.name
     * @param {string} restaurantData.address
     * @param {number} restaurantData.phone
     * @param {string} restaurantData.created_at
     * @returns {Promise<void>}
     */
    async createRestaurant({ restaurant_uuid, name, address, phone, created_at }) {
        const conn = await getConnection();
        await conn.execute(
            'INSERT INTO restaurants (restaurant_uuid, name, address, phone, created_at) VALUES (?, ?, ?, ?, ?)',
            [restaurant_uuid, name, address, phone, created_at]
        );
        await conn.end();
    },

    /**
     * Update an existing restaurant
     * @param {string} restaurant_uuid
     * @param {Object} restaurantData
     * @param {string} restaurantData.name
     * @param {string} restaurantData.address
     * @param {number} restaurantData.phone
     * @param {string} restaurantData.created_at
     * @returns {Promise<boolean>} - True if updated, false if restaurant not found
     */
    async updateRestaurant(restaurant_uuid, { name, address, phone, created_at }) {
        const conn = await getConnection();

        const [result] = await conn.execute(
            'UPDATE restaurants SET name = ?, address = ?, phone = ?, created_at = ? WHERE restaurant_uuid = ?',
            [name, address, phone, created_at, restaurant_uuid]
        );

        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Delete a restaurant by UUID
     * @param {string} restaurant_uuid
     * @returns {Promise<boolean>} - True if deleted, false if not found
     */
    async deleteRestaurant(restaurant_uuid) {
        const conn = await getConnection();
        const [result] = await conn.execute('DELETE FROM restaurants WHERE restaurant_uuid = ?', [restaurant_uuid]);
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Check if a restaurant exists by UUID
     * @param {string} restaurant_uuid
     * @returns {Promise<boolean>}
     */
    async restaurantExists(restaurant_uuid) {
        const conn = await getConnection();
        const [rows] = await conn.execute('SELECT 1 FROM restaurants WHERE restaurant_uuid = ? LIMIT 1', [restaurant_uuid]);
        await conn.end();
        return rows.length > 0;
    }
};

module.exports = RestaurantModel;

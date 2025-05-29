
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { validateRestaurantData, validateUuid } = require('../utils/RestaurantValidation');
const logger = require('../utils/logger');
const RestaurantModel = require('../models/restaurant.model');
/**
 * Get all Restaurants with optional pagination.
 */
const getAllRestaurants = async (req, res) => {
    let query = 'SELECT * FROM restaurants';
    const limit = req.query.limit && /^\d+$/.test(req.query.limit) ? parseInt(req.query.limit, 10) : null;
    const offset = req.query.offset && /^\d+$/.test(req.query.offset) ? parseInt(req.query.offset, 10) : null;

    if (req.query.limit && (isNaN(limit) || limit <= 0)) {
        return res.status(400).json({ message: 'Invalid limit value. Must be a positive integer.' });
    }

    if (req.query.offset && (isNaN(offset) || offset < 0)) {
        return res.status(400).json({ message: 'Invalid offset value. Must be a non-negative integer.' });
    }

    if (limit !== null) {
        query += ` LIMIT ${limit}`;
    }

    if (offset !== null && limit !== null) {
        query += ` OFFSET ${offset}`;
    }

    try {
        const conn = await db.createConnection();
        const [restaurants] = await conn.execute(query);
        await conn.end();
        return res.status(200).json(restaurants);
    } catch (error) {
        logger.error('Error fetching restaurants:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Get a single Restaurant by UUID.
 */
const getRestaurantById = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    try {
        const conn = await db.createConnection();
        const [rows] = await conn.execute('SELECT * FROM restaurants WHERE restaurant_uuid = ?', [id]);
        await conn.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        logger.error('Error fetching restaurants by ID:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Create a new restaurants.
 */
const createRestaurant = async (req, res) => {
    const RestaurantValidation = validateRestaurantData(req.body);
    if (!RestaurantValidation.valid) {
        return res.status(400).json({ message: RestaurantValidation.message });
    }

    const { name, address, phone, created_at } = req.body;
    const restaurant_uuid = uuidv4();

    try {
        const conn = await db.createConnection();
        const formattedDate = new Date(created_at).toISOString().slice(0, 19).replace('T', ' ');

        await conn.execute(
            'INSERT INTO restaurants (restaurant_uuid, name, address, phone, created_at) VALUES (?, ?, ?, ?, ?)',
            [restaurant_uuid, name, address, phone, formattedDate]
        );
        await conn.end();

        return res.status(201).json({ restaurant_uuid, name, address, phone, created_at });
    } catch (error) {
        logger.error('Error creating restaurants:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Update an existing restaurants.
 */
const updateRestaurant = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    const RestaurantValidation = validateRestaurantData(req.body);
    if (!RestaurantValidation.valid) {
        return res.status(400).json({ message: RestaurantValidation.message });
    }

    const { name, address, phone, created_at } = req.body;

    try {
        const conn = await db.createConnection();
        const [existing] = await conn.execute('SELECT * FROM restaurants WHERE restaurant_uuid = ?', [id]);

        if (existing.length === 0) {
            await conn.end();
            return res.status(404).json({ message: 'Restaurant not found.' });
        }
        const formattedDate = new Date(created_at).toISOString().slice(0, 19).replace('T', ' ');
        await conn.execute(
            'UPDATE restaurants SET name = ?, address = ?, phone = ?, created_at = ? WHERE restaurant_uuid = ?',
            [name, address, phone, formattedDate, id]
        );
        await conn.end();

        return res.status(200).json({ message: 'Restaurant updated successfully.' });
    } catch (error) {
        logger.error('Error updating restaurants:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Delete a restaurants by UUID.
 */
const deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    try {
        const conn = await db.createConnection();
        const [existing] = await conn.execute('SELECT * FROM restaurants WHERE restaurant_uuid = ?', [id]);

        if (existing.length === 0) {
            await conn.end();
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        await conn.execute('DELETE FROM restaurants WHERE restaurant_uuid = ?', [id]);
        await conn.end();

        return res.status(204).json({ message: 'Book deleted successfully.' });
    } catch (error) {
        logger.error('Error deleting book:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
};

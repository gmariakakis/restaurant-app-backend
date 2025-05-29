const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { validateRestaurantData, validateUuid } = require('../utils/RestaurantValidation');
const logger = require('../utils/logger');

const getAllRestaurants = async (req, res) => {
    let query = 'SELECT * FROM restaurants WHERE 1=1';
    const params = [];
    const { search, limit, offset } = req.query;
    if (search) {
        query += ' AND (name LIKE ? OR region LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    const parsedLimit = limit && /^\d+$/.test(limit) ? parseInt(limit, 10) : null;
    const parsedOffset = offset && /^\d+$/.test(offset) ? parseInt(offset, 10) : null;
    if (parsedLimit !== null) {
        query += ' LIMIT ?';
        params.push(parsedLimit);
    }
    if (parsedOffset !== null && parsedLimit !== null) {
        query += ' OFFSET ?';
        params.push(parsedOffset);
    }
    try {
        const conn = await db.createConnection();
        const [restaurants] = await conn.execute(query, params);
        await conn.end();
        return res.status(200).json(restaurants);
    } catch (error) {
        logger.error('Error fetching restaurants:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

const getRestaurantById = async (req, res) => {
    const { id } = req.params;
    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID.' });
    }
    try {
        const conn = await db.createConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM restaurants WHERE restaurant_uuid = ?',
            [id]
        );
        await conn.end();
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Not found.' });
        }
        return res.status(200).json(rows[0]);
    } catch (err) {
        logger.error('Error fetching by ID:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

const createRestaurant = async (req, res) => {
    const check = validateRestaurantData(req.body);
    if (!check.valid) {
        return res.status(400).json({ message: check.message });
    }
    const { name, address, phone, created_at, region, description } = req.body;
    const uuid = uuidv4();
    const formattedDate = new Date(created_at).toISOString().slice(0, 19).replace('T', ' ');
    try {
        const conn = await db.createConnection();
        await conn.execute(
            `INSERT INTO restaurants
             (restaurant_uuid, name, address, phone, region, description, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [uuid, name, address, phone, region, description || null, formattedDate]
        );
        await conn.end();
        return res.status(201).json({ restaurant_uuid: uuid, ...req.body });
    } catch (err) {
        logger.error('Error creating:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

const updateRestaurant = async (req, res) => {
    const { id } = req.params;
    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID.' });
    }
    const check = validateRestaurantData(req.body);
    if (!check.valid) {
        return res.status(400).json({ message: check.message });
    }
    const { name, address, phone, created_at, region, description } = req.body;
    const formattedDate = new Date(created_at).toISOString().slice(0, 19).replace('T', ' ');
    try {
        const conn = await db.createConnection();
        const [existing] = await conn.execute(
            'SELECT 1 FROM restaurants WHERE restaurant_uuid = ?',
            [id]
        );
        if (existing.length === 0) {
            await conn.end();
            return res.status(404).json({ message: 'Not found.' });
        }
        await conn.execute(
            `UPDATE restaurants
             SET name=?, address=?, phone=?, region=?, description=?, created_at=?
             WHERE restaurant_uuid=?`,
            [name, address, phone, region, description || null, formattedDate, id]
        );
        await conn.end();
        return res.status(200).json({ message: 'Updated.' });
    } catch (err) {
        logger.error('Error updating:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

const deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID.' });
    }
    try {
        const conn = await db.createConnection();
        const [existing] = await conn.execute(
            'SELECT 1 FROM restaurants WHERE restaurant_uuid = ?',
            [id]
        );
        if (existing.length === 0) {
            await conn.end();
            return res.status(404).json({ message: 'Not found.' });
        }
        await conn.execute('DELETE FROM restaurants WHERE restaurant_uuid = ?', [id]);
        await conn.end();
        return res.status(204).send();
    } catch (err) {
        logger.error('Error deleting:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};

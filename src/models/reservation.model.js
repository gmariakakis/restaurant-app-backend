// src/models/reservation.model.js
const { createConnection } = require('../config/database');


/**
 * Επιστρέφει μια νέα σύνδεση MySQL
 */
async function getConnection() {
    return createConnection();
}

module.exports = {
    /** Επιστρέφει όλες τις κρατήσεις ενός χρήστη */
    async getByUser(user_id) {
        const conn = await getConnection();
        const [rows] = await conn.execute(
            `SELECT r.*, res.name AS restaurant_name
         FROM reservations r
         JOIN restaurants res ON r.restaurant_id = res.restaurant_id
        WHERE r.user_id = ?`,
            [user_id]
        );
        await conn.end();
        return rows;
    },

    /** Επιστρέφει κράτηση βάσει UUID */
    async getByUuid(reservation_uuid) {
        const conn = await getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM reservations WHERE reservation_uuid = ?',
            [reservation_uuid]
        );
        await conn.end();
        return rows[0];
    },

    /** Δημιουργεί νέα κράτηση */
    async create({ reservation_uuid, user_id, restaurant_id, reservation_datetime, guests, status }) {
        const conn = await getConnection();
        const [result] = await conn.execute(
            `INSERT INTO reservations
         (reservation_uuid, user_id, restaurant_id, reservation_datetime, guests, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [reservation_uuid, user_id, restaurant_id, reservation_datetime, guests, status]
        );
        await conn.end();
        return result;
    },

    /** Ενημερώνει υπάρχουσα κράτηση */
    async update(reservation_uuid, { reservation_datetime, guests }) {
        const conn = await getConnection();
        const [result] = await conn.execute(
            `UPDATE reservations
          SET reservation_datetime = ?, guests = ?
        WHERE reservation_uuid = ?`,
            [reservation_datetime, guests, reservation_uuid]
        );
        await conn.end();
        return result;
    },

    /** Διαγράφει κράτηση */
    async remove(reservation_uuid) {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'DELETE FROM reservations WHERE reservation_uuid = ?',
            [reservation_uuid]
        );
        await conn.end();
        return result;
    }
};

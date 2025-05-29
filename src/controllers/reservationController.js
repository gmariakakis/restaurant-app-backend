// src/controllers/reservationController.js
const { v4: uuidv4 }         = require('uuid');
const ReservationModel       = require('../models/reservation.model');
const { validateReservationData } = require('../utils/ReservationValidation');
const logger                 = require('../utils/logger');
const AccountModel           = require('../models/account.model');

/** GET /api/reservations/me */
const getMyReservations = async (req, res) => {
    try {
        const rows = await ReservationModel.getByUser(req.user.id);{ console.log('>>> current user', req.user); }
        return res.status(200).json(rows);
    } catch (err) {
        logger.error('Get reservations error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

/** POST /api/reservations */
const createReservation = async (req, res) => {
    const check = validateReservationData(req.body);
    if (!check.valid) {
        return res.status(400).json({ message: check.message });
    }

    let { restaurant_id, reservation_datetime, guests } = req.body;
    const reservation_uuid = uuidv4();

    // format ISO → MySQL DATETIME
    const dt = new Date(reservation_datetime);
    reservation_datetime = dt
        .toISOString()    // "2025-06-28T19:53:31.516Z"
        .slice(0, 19)     // "2025-06-28T19:53:31"
        .replace('T', ' ');

    try {
        // load numeric user id from uuid
        const userRecord = await AccountModel.getByUuid(req.user.uuid);
        if (!userRecord) {
            return res.status(404).json({ message: 'User not found' });
        }

        await ReservationModel.create({
            reservation_uuid,
            user_id:               userRecord.id,
            restaurant_id,
            reservation_datetime,
            guests,
            status:               'confirmed'
        });

        return res.status(201).json({
            reservation_uuid,
            restaurant_id,
            reservation_datetime,
            guests,
            status:             'confirmed'
        });
    } catch (err) {
        logger.error('Create reservation error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

/** PUT /api/reservations/:uuid */
const updateReservation = async (req, res) => {
    const { uuid }               = req.params;
    const { reservation_datetime, guests } = req.body;

    try {
        const existing = await ReservationModel.getByUuid(uuid);
        if (!existing) {
            return res.status(404).json({ message: 'Not found' });
        }
        if (existing.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await ReservationModel.update(uuid, { reservation_datetime, guests });
        return res.status(200).json({ message: 'Updated successfully' });
    } catch (err) {
        logger.error('Update reservation error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

/** DELETE /api/reservations/:uuid */
const deleteReservation = async (req, res) => {
    const { uuid } = req.params;
    try {
        const existing = await ReservationModel.getByUuid(uuid);
        if (!existing) {
            return res.status(404).json({ message: 'Not found' });
        }
        if (existing.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await ReservationModel.remove(uuid);
        return res.status(204).send();
    } catch (err) {
        logger.error('Delete reservation error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMyReservations,
    createReservation,
    updateReservation,
    deleteReservation
};

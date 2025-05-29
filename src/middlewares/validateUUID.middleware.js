const { validate: isUuid } = require('uuid');

/**
 * Ελέγχει ότι 1 από τα route-params (uuid | id | reservation_id | restaurant_id)
 * είναι έγκυρο UUID-v4. Αν όχι => 400.
 */
const validateUUID = (req, res, next) => {
    const uuid =
        req.params.uuid ||
        req.params.id   ||
        req.params.reservation_id ||
        req.params.restaurant_id;

    if (!uuid || !isUuid(uuid)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }
    next();
};

module.exports = { validateUUID };
// ReservationValidation.js
const { validate: validateUuidV4 } = require('uuid');

/**
 * Check if a string is a valid UUID v4.
 * @param {string} uuid
 * @returns {boolean}
 */
function validateUuid(uuid) {
    return validateUuidV4(uuid);
}

/**
 * Validate reservation payload.
 * Mandatory: reservation_datetime (ISO string), guests (>0).
 * @param {object} data
 * @returns {{ valid:boolean, message?:string }}
 */
function validateReservationData(data = {}) {
    const { reservation_datetime, guests } = data;

    // reservation_datetime – required & valid date-time
    if (!reservation_datetime || isNaN(Date.parse(reservation_datetime))) {
        return {
            valid: false,
            message: 'Invalid or missing "reservation_datetime". Must be a valid ISO datetime string.'
        };
    }

    // guests – required & positive integer
    if (typeof guests !== 'number' || isNaN(guests) || guests <= 0) {
        return {
            valid: false,
            message: 'Invalid or missing "guests". Must be a positive number.'
        };
    }

    return { valid: true };
}

module.exports = { validateUuid, validateReservationData };

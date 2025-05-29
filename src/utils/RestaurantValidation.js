
const { validate: validateUuidV4 } = require('uuid');
const {add} = require("winston");

/**
 * Validate if a string is a valid UUID v4.
 * @param {string} restaurant_uuid - UUID string to validate.
 * @returns {boolean} True if valid UUID v4, false otherwise.
 */
function validateUuid(restaurant_uuid) {
    return validateUuidV4(restaurant_uuid);
}

/**
 * Validate the structure and types of a Restaurant object.
 * @param {object} restaurants - Restaurant object to validate.
 * @param {string} restaurants.name
 * @param {string} restaurants.address
 * @param {string} restaurants.phone
 * @param {string} restaurants.created_at
 * @returns {{ valid: boolean, message?: string }}
 */
function validateRestaurantData(restaurants) {
    if (!restaurants || typeof restaurants !== 'object') {
        return { valid: false, message: 'Restaurant data must be a valid object.' };
    }

    const { name, address, phone, created_at } = restaurants;

    if (!name || typeof name !== 'string') {
        return { valid: false, message: 'Invalid or missing "name".' };
    }
    if (!address || typeof address !== 'string') {
        return { valid: false, message: 'Invalid or missing "address".' };
    }
    if (!phone || typeof phone !== 'string') {
        return { valid: false, message: 'Invalid or missing "phone".' };
    }
    if (!created_at || typeof created_at !== 'string') {
        return { valid: false, message: 'Invalid or missing "created_at".' };
    }

    return { valid: true };
}

module.exports = {
    validateUuid,
    validateRestaurantData
};

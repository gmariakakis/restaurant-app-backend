const { validate: validateUuidV4 } = require('uuid');

function validateUuid(restaurant_uuid) {
    return validateUuidV4(restaurant_uuid);
}

function validateRestaurantData(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, message: 'Restaurant data must be an object.' };
    }
    const { name, address, phone, created_at, region, description } = data;
    if (!name || typeof name !== 'string') {
        return { valid: false, message: 'Invalid or missing "name".' };
    }
    if (!address || typeof address !== 'string') {
        return { valid: false, message: 'Invalid or missing "address".' };
    }
    if (!region || typeof region !== 'string') {
        return { valid: false, message: 'Invalid or missing "region".' };
    }
    if (!phone || typeof phone !== 'string') {
        return { valid: false, message: 'Invalid or missing "phone".' };
    }
    if (!created_at || typeof created_at !== 'string') {
        return { valid: false, message: 'Invalid or missing "created_at".' };
    }
    if (description && typeof description !== 'string') {
        return { valid: false, message: 'Invalid "description". Must be text.' };
    }
    return { valid: true };
}

module.exports = {
    validateUuid,
    validateRestaurantData
};

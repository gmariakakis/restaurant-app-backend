
const { validate: validateUuidV4 } = require('uuid');

/**
 * Validate if a string is a valid UUID v4.
 * @param {string} uuid - UUID string to validate.
 * @returns {boolean} True if valid UUID v4, false otherwise.
 */
function validateUuid(uuid) {
    return validateUuidV4(uuid);
}

/**
 * Validate the structure and types of a book object.
 * @param {object} book - Book object to validate.
 * @param {string} book.title
 * @param {string} book.author
 * @param {number} book.published_year
 * @param {string} book.genre
 * @returns {{ valid: boolean, message?: string }}
 */
function validateBookData(book) {
    if (!book || typeof book !== 'object') {
        return { valid: false, message: 'Book data must be a valid object.' };
    }

    const { title, author, published_year, genre } = book;

    if (!title || typeof title !== 'string') {
        return { valid: false, message: 'Invalid or missing "title".' };
    }
    if (!author || typeof author !== 'string') {
        return { valid: false, message: 'Invalid or missing "author".' };
    }
    if (typeof published_year !== 'number' || published_year < 0) {
        return { valid: false, message: 'Invalid or missing "published_year".' };
    }
    if (!genre || typeof genre !== 'string') {
        return { valid: false, message: 'Invalid or missing "genre".' };
    }

    return { valid: true };
}

module.exports = {
    validateUuid,
    validateBookData
};

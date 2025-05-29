// // routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const {validateUUID} = require("../middlewares/validateUUID.middleware");

// Public routes

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Retrieve a list of restaurants
 *     description: Fetches all restaurants from the database with optional pagination.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Maximum number of restaurants to return (optional).
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *         description: Number of restaurants to skip before starting to collect the result set (optional).
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of restaurants.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *               examples:
 *                  multipleRestaurants:
 *                    summary: Example response with multiple Restaurants
 *                    value:
 *                      - uuid: "123e4567-e89b-12d3-a456-426614174000"
 *                        title: "The Great Gatsby"
 *                        author: "F. Scott Fitzgerald"
 *                        published_year: 1925
 *                        genre: "Fiction"
 *                      - uuid: "456e7890-f12b-34c5-d678-91011a121314"
 *                        title: "1984"
 *                        author: "George Orwell"
 *                        published_year: 1949
 *                        genre: "Dystopian"
 *       400:
 *         description: Bad request - Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid limit or offset value. Must be a positive integer."
 *       500:
 *         description: Internal Server Error - Unexpected database issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error. Please try again later."
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Retrieve a restaurant by UUID
 *     description: Fetches a single restaurant from the database using its UUID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The UUID of the restaurant to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the restaurant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Restaurant"
 *             examples:
 *               singleRestaurant:
 *                 summary: Example response with a restaurant
 *                 value:
 *                   uuid: "123e4567-e89b-12d3-a456-426614174000"
 *                   title: "The Great Gatsby"
 *                   author: "F. Scott Fitzgerald"
 *                   published_year: 1925
 *                   genre: "Fiction"
 *       400:
 *         description: Bad request - Invalid UUID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid UUID format."
 *       404:
 *         description: Restaurant not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: " not found."
 *       500:
 *         description: Internal Server Error - Unexpected database issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error. Please try again later."
 */
router.get('/:id', restaurantController.getRestaurantById);

// Protected routes

/**
 * @swagger
 * /api/restaurant:
 *   post:
 *     summary: Add a new restaurant
 *     description: Creates a new restaurant record in the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RestaurantInput"
 *           examples:
 *             newRestaurant:
 *               summary: Example of a restaurant to be created
 *               value:
 *                 title: "To Kill a Mockingbird"
 *                 author: "Harper Lee"
 *                 published_year: 1960
 *                 genre: "Fiction"
 *     responses:
 *       201:
 *         description: Restaurant successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 title:
 *                   type: string
 *                   example: "The Great Gatsby"
 *                 author:
 *                   type: string
 *                   example: "F. Scott Fitzgerald"
 *                 published_year:
 *                   type: integer
 *                   example: 1925
 *                 genre:
 *                   type: string
 *                   example: "Fiction"
 *       400:
 *         description: Bad request - Missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data. All fields (title, author, published_year, genre) are required."
 *       401:
 *         description: Unauthorized - Missing authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No token provided"
 *       403:
 *         description: Forbidden - Invalid or expired authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Invalid token"
 *       500:
 *         description: Internal Server Error - Unexpected database issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error. Please try again later."
 */
router.post('/', authenticateToken, restaurantController.createRestaurant);

/**
 * @swagger
 * /api/restaurant/{id}:
 *   put:
 *     summary: Update an existing restaurant
 *     description: Updates details of an existing restaurant in the database.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The UUID of the restaurant to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               published_year:
 *                 type: integer
 *                 example: 1925
 *               genre:
 *                 type: string
 *                 example: "Fiction"
 *             required:
 *               - title
 *               - author
 *               - published_year
 *               - genre
 *     responses:
 *       200:
 *         description: r successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "r updated successfully."
 *       400:
 *         description: Bad request - Missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data. All fields (title, author, published_year, genre) are required."
 *       401:
 *         description: Unauthorized - Missing authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No token provided"
 *       403:
 *         description: Forbidden - Invalid or expired authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Invalid token"
 *       404:
 *         description: r not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "r not found."
 *       500:
 *         description: Internal Server Error - Unexpected database issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error. Please try again later."
 */
router.put('/:id', [authenticateToken, validateUUID], restaurantController.updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a re
 *     description: Removes a re from the database using its UUID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The UUID of the r to delete.
 *     responses:
 *       204:
 *         description: re successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "re deleted successfully."
 *       400:
 *         description: Bad request - Invalid UUID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid UUID format."
 *       401:
 *         description: Unauthorized - Missing authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No token provided"
 *       403:
 *         description: Forbidden - Invalid or expired authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Invalid token"
 *       404:
 *         description: re not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "re not found."
 *       500:
 *         description: Internal Server Error - Unexpected database issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error. Please try again later."
 */
router.delete('/:id', authenticateToken, restaurantController.deleteRestaurant);

module.exports = router;

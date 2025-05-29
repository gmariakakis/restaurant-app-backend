// // routes/reservationRoutes.js
const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateUUID } = require('../middlewares/validateUUID.middleware');

/* ---------------------- PUBLIC ---------------------- */

/*    '/restaurant/:restaurant_id',
    validateUUID,
    reservationController.getReservationsByRestaurantId
);
*/
/* -------------------- PROTECTED --------------------- */
// Ο χρήστης πρέπει να είναι συνδεδεμένος
router.use(authenticateToken);

/** Όλες οι κρατήσεις του τρέχοντος χρήστη */
router.get('/me', reservationController.getMyReservations);

/** Δημιουργία νέας κράτησης */
/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error - missing/invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "reservation_datetime and guests are required"
 */
router.post('/', reservationController.createReservation);

/** Ενημέρωση κράτησης */
/**
 * @swagger
 * /api/reservations/{uuid}:
 *   put:
 *     summary: Update an existing reservation
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['reservation_datetime','guests']
 *             properties:
 *               reservation_datetime:
 *                 type: string
 *                 format: date-time
 *               guests:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reservation updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Updated successfully"
 *       400:
 *         description: Validation error.
 */
router.put('/:uuid', validateUUID, reservationController.updateReservation);

/** Ακύρωση κράτησης */
/**
 * @swagger
 * /api/reservations/{uuid}:
 *   delete:
 *     summary: Ακύρωση κράτησης
 *     description: Ακυρώνει (διαγράφει) μια κράτηση βάσει του UUID της. Χρειάζεται authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Το UUID της κράτησης που θα διαγραφεί.
 *     responses:
 *       204:
 *         description: Η κράτηση διαγράφηκε επιτυχώς (No Content).
 *       400:
 *         description: Άκυρο UUID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid UUID format."
 *       401:
 *         description: Χωρίς έγκυρο token.
 *       403:
 *         description: Forbidden - η κράτηση δεν ανήκει στον χρήστη.
 *       404:
 *         description: Η κράτηση δεν βρέθηκε.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found"
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/:uuid', validateUUID, reservationController.deleteReservation);

module.exports = router;

// routes/index.js
const express = require('express');
const router = express.Router();


const restaurantRoutes = require('./restaurantRoutes');
const reservationRoutes = require('./reservationRoutes');
const authRoutes = require('./authRoutes');
//const router = require('express').Router();

// These will now be /api/books and /api/login (correct)
console.log('>>> ROUTES INDEX LOADED');
router.use('/restaurants', restaurantRoutes);
router.use('/', authRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;

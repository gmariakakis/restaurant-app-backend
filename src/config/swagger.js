// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const path         = require('path');
const config       = require('./index');

const options = {
    definition: {
        openapi: '3.1.1',
        info: {
            title: 'Reservations API',
            version: '1.0.0',
            description: 'Simple API for reservations management'
        },
        servers: [
            { url: `http://localhost:${config.app.port || 3000}` }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type:         'http',
                    scheme:       'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id:       { type: 'integer' },
                        uuid:     { type: 'string',  format: 'uuid' },
                        username: { type: 'string' },
                        email:    { type: 'string',  format: 'email' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        accessToken:  { type: 'string' },
                        refreshToken: { type: 'string' }
                    }
                },
                Restaurant: {
                    type: 'object',
                    properties: {
                        restaurant_id: { type: 'integer', example: 1 },
                        uuid:          { type: 'string',  format: 'uuid' },
                        name:          { type: 'string',  example: 'La Trattoria' },
                        location:      { type: 'string',  example: 'Athens' },
                        description:   { type: 'string',  example: 'Ιταλικό εστιατόριο' }
                    }
                },
                RestaurantInput: {
                    type:     'object',
                    required: ['name','location','description'],
                    properties: {
                        name:        { type: 'string' },
                        location:    { type: 'string' },
                        description: { type: 'string' }
                    }
                },
                Reservation: {
                    type: 'object',
                    properties: {
                        reservation_uuid:     { type: 'string', format: 'uuid' },
                        user_id:              { type: 'integer' },
                        restaurant_id:        { type: 'integer' },
                        reservation_datetime: { type: 'string',  format: 'date-time' },
                        guests:               { type: 'integer', example: 2 },
                        status:               { type: 'string',  example: 'confirmed' }
                    }
                },
                ReservationInput: {
                    type:     'object',
                    required: ['restaurant_id','reservation_datetime','guests'],
                    properties: {
                        restaurant_id:        { type: 'integer' },
                        reservation_datetime: { type: 'string',  format: 'date-time' },
                        guests:               { type: 'integer' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: [
        // θα σαρώσει όλα τα routes για τα @swagger comments
        path.join(__dirname, '../routes/**/*.js'),
    ]
};

module.exports = swaggerJsdoc(options);


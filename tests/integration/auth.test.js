// auth.test.js
const request = require('supertest');
const app = require('./setup');

describe('Auth API', () => {
    it('should return a JWT token for valid username', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'testuser' });

        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(typeof res.body.accessToken).toBe('string');
    });

    it('should return 400 for missing username', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/username/i);
    });
});

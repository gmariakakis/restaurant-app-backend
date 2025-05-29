// books.test.js
const request = require('supertest');
const app = require('./setup');

let token;
let createdBookId;

beforeAll(async () => {
    const res = await request(app)
        .post('/api/login')
        .send({ username: 'tester' });

    token = res.body.accessToken;
});

describe('Books API', () => {
    it('should retrieve books (public route)', async () => {
        const res = await request(app).get('/api/books');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a book', async () => {
        const res = await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Book',
                author: 'Test Author',
                published_year: 2024,
                genre: 'Test Genre'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.uuid).toBeDefined();
        createdBookId = res.body.uuid;
    });

    it('should retrieve a specific book', async () => {
        const res = await request(app).get(`/api/books/${createdBookId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.uuid).toBe(createdBookId);
    });

    it('should update the book', async () => {
        const res = await request(app)
            .put(`/api/books/${createdBookId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Book',
                author: 'Updated Author',
                published_year: 2025,
                genre: 'Updated Genre'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/updated/i);
    });

    it('should delete the book', async () => {
        const res = await request(app)
            .delete(`/api/books/${createdBookId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});

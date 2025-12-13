const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Sweet = require('../src/models/Sweet');
const User = require('../src/models/User');

let token;

beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(url);
});

beforeEach(async () => {
    // Create a user and get a token before each test
    await User.deleteMany();
    await Sweet.deleteMany();

    const userRes = await request(app).post('/api/auth/register').send({
        email: 'admin@example.com',
        password: 'password123'
    });

    // Login to get token
    const loginRes = await request(app).post('/api/auth/login').send({
        email: 'admin@example.com',
        password: 'password123'
    });

    token = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/sweets', () => {
    it('should deny access if no token is provided', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .send({
                name: 'Gulab Jamun',
                category: 'Milk',
                price: 10,
                quantity: 100
            });
        expect(res.statusCode).toEqual(401);
    });

    it('should create a new sweet when authenticated', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${token}`) // Send the token!
            .send({
                name: 'Kaju Katli',
                category: 'Dry Fruit',
                price: 20,
                quantity: 50
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Kaju Katli');

        // Verify it's in the DB
        const sweet = await Sweet.findOne({ name: 'Kaju Katli' });
        expect(sweet).toBeTruthy();
    });
});
describe('GET /api/sweets', () => {
    it('should return a list of sweets when authenticated', async () => {
        // 1. Create a sweet first
        const sweetData = {
            name: 'Mysore Pak',
            category: 'Ghee',
            price: 25,
            quantity: 30
        };
        await Sweet.create(sweetData);

        // 2. Request the list
        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${token}`); // Use the token from beforeEach

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Mysore Pak');
    });

    it('should deny access without token', async () => {
        const res = await request(app).get('/api/sweets');
        expect(res.statusCode).toEqual(401);
    });
});
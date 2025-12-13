const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Sweet = require('../src/models/Sweet');
const User = require('../src/models/User');

let token;

// Connect to DB
beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(url);
});

// Reset DB and Get Token before EACH test
beforeEach(async () => {
    await User.deleteMany();
    await Sweet.deleteMany();

    // Register a standard user to get a valid token
    const res = await request(app).post('/api/auth/register').send({
        email: 'admin@example.com',
        password: 'password123'
    });

    token = res.body.token;
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// --- CREATE TESTS ---
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
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Kaju Katli',
                category: 'Dry Fruit',
                price: 20,
                quantity: 50,
                description: 'Delicious cashew fudge'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Kaju Katli');
    });
});

// --- READ/LIST TESTS ---
describe('GET /api/sweets', () => {
    it('should return a list of sweets when authenticated', async () => {
        await Sweet.create({
            name: 'Mysore Pak',
            category: 'Ghee',
            price: 25,
            quantity: 30
        });

        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Mysore Pak');
    });
});

// --- PURCHASE TESTS (NEW) ---
describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    // Create a specific sweet for this test suite
    beforeEach(async () => {
        const sweet = await Sweet.create({
            name: 'Ladoo',
            category: 'Ghee',
            price: 15,
            quantity: 1 // Only 1 left!
        });
        sweetId = sweet._id;
    });

    it('should decrease quantity by 1 on purchase', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Purchase successful');

        // Check DB
        const updatedSweet = await Sweet.findById(sweetId);
        expect(updatedSweet.quantity).toBe(0);
    });

    it('should fail if sweet is out of stock', async () => {
        // Buy the last one first
        await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${token}`);

        // Try to buy again
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Sweet is out of stock');
    });
});

// --- DELETE TESTS ---
describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
        const sweet = await Sweet.create({
            name: 'Rasgulla',
            category: 'Syrup',
            price: 15,
            quantity: 20
        });
        sweetId = sweet._id;
    });

    it('should not allow non-admin users to delete sweets', async () => {
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403);
    });

    it('should allow admin users to delete sweets', async () => {
        // Register a REAL Admin
        const adminRes = await request(app).post('/api/auth/register').send({
            email: 'admin@test.com', // Magic email
            password: 'password123'
        });
        const adminToken = adminRes.body.token;

        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
    });
});
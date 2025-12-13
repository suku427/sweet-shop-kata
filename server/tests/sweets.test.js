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

describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    // Create a sweet to delete
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
        // We use the 'token' variable from the top of the file, which belongs to a default user (default role is 'user')
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403); // Forbidden
    });

    it('should allow admin users to delete sweets', async () => {
        // 1. Create an Admin User
        await User.create({
            email: 'admin_real@example.com',
            password: 'password123',
            role: 'admin' // Force role to admin
        });

        // 2. Login as Admin to get token
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin_real@example.com',
            password: 'password123'
        });
        const adminToken = loginRes.body.token;

        // 3. Delete
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Sweet deleted successfully');

        // 4. Verify it's gone
        const check = await Sweet.findById(sweetId);
        expect(check).toBeNull();
    });
});
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Connect to a test database before running tests
beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(url);
});

// Clean up database after each test
afterEach(async () => {
    await User.deleteMany();
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// --- REGISTER TESTS ---
describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');

        // Verify user is actually in database
        const user = await User.findOne({ email: 'test@example.com' });
        expect(user).toBeTruthy();
        expect(user.email).toBe('test@example.com');
    });

    it('should not register a user with an existing email', async () => {
        // Create first user
        await User.create({ email: 'duplicate@example.com', password: 'password123' });

        // Try to create second user with same email
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'duplicate@example.com',
                password: 'newpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });
});

// --- NEW LOGIN TESTS (Add this part) ---
describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
        // 1. Register a user first
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });

        // 2. Try to login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token'); // Ensure we get a JWT
    });

    it('should reject login with incorrect password', async () => {
        // 1. Register a user
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'wrongpass@example.com',
                password: 'password123'
            });

        // 2. Try to login with wrong password
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrongpass@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
});
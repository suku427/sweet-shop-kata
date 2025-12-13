const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import routes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // Use routes

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Sweet Shop API is running' });
});

module.exports = app;
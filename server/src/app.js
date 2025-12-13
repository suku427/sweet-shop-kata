const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import routes
const sweetsRoutes = require('./routes/sweetsRoutes'); // Import
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // Use routes
app.use('/api/sweets', sweetsRoutes); // Use
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Sweet Shop API is running' });
});

module.exports = app;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the token from the header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded; // Attach user info to the request
        next(); // Move to the next middleware/controller
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};
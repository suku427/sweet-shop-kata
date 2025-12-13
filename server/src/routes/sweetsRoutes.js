const express = require('express');
const router = express.Router();
const sweetsController = require('../controllers/sweetsController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect this route with authMiddleware
router.post('/', authMiddleware, sweetsController.createSweet);

module.exports = router;
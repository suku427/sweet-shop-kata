const express = require('express');
const router = express.Router();
const sweetsController = require('../controllers/sweetsController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect this route with authMiddleware
router.post('/', authMiddleware, sweetsController.createSweet);
router.get('/', authMiddleware, sweetsController.getAllSweets);

module.exports = router;
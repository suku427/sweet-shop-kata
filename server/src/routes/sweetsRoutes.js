const express = require('express');
const router = express.Router();
const sweetsController = require('../controllers/sweetsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Import
// Protect this route with authMiddleware
router.post('/', authMiddleware, sweetsController.createSweet);
router.get('/', authMiddleware, sweetsController.getAllSweets);
router.get('/search', authMiddleware, sweetsController.searchSweets);
router.delete('/:id', authMiddleware, adminMiddleware, sweetsController.deleteSweet);

module.exports = router;
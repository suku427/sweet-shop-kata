const Sweet = require('../models/Sweet');

exports.createSweet = async (req, res) => {
    try {
        const { name, category, price, quantity, description } = req.body;

        const sweet = new Sweet({
            name,
            category,
            price,
            quantity,
            description
        });

        await sweet.save();
        res.status(201).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
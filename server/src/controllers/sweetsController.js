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

exports.getAllSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteSweet = async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }

        await sweet.deleteOne(); // or Sweet.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
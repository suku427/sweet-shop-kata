// const Sweet = require('../models/Sweet');

// exports.createSweet = async (req, res) => {
//     try {
//         const { name, category, price, quantity, description } = req.body;

//         const sweet = new Sweet({
//             name,
//             category,
//             price,
//             quantity,
//             description
//         });

//         await sweet.save();
//         res.status(201).json(sweet);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// exports.getAllSweets = async (req, res) => {
//     try {
//         const sweets = await Sweet.find().sort({ createdAt: -1 }); // Newest first
//         res.status(200).json(sweets);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// exports.deleteSweet = async (req, res) => {
//     try {
//         const sweet = await Sweet.findById(req.params.id);
//         if (!sweet) {
//             return res.status(404).json({ message: 'Sweet not found' });
//         }

//         await sweet.deleteOne(); // or Sweet.findByIdAndDelete(req.params.id)
//         res.status(200).json({ message: 'Sweet deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// exports.searchSweets = async (req, res) => {
//     try {
//         const { query } = req.query;

//         // Create a case-insensitive regex
//         const searchRegex = new RegExp(query, 'i');

//         const sweets = await Sweet.find({
//             $or: [
//                 { name: searchRegex },
//                 { category: searchRegex }
//             ]
//         });

//         res.status(200).json(sweets);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };
const Sweet = require('../models/Sweet');

exports.createSweet = async (req, res) => {
    try {
        const { name, price, description, category, quantity, imageUrl } = req.body;
        const sweet = new Sweet({
            name,
            price,
            description,
            category,
            quantity, // Ensure quantity is saved
            imageUrl
        });
        await sweet.save();
        res.status(201).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find();
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- THIS WAS MISSING ---
exports.searchSweets = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Query parameter required" });

        // Search by name or category (case-insensitive regex)
        const sweets = await Sweet.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSweetById = async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.status(200).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateSweet = async (req, res) => {
    try {
        const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.status(200).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteSweet = async (req, res) => {
    try {
        const sweet = await Sweet.findByIdAndDelete(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
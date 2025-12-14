require('dotenv').config(); // Load env vars
const mongoose = require('mongoose');
const Sweet = require('./models/Sweet'); // Adjust path if needed

const sweets = [
    {
        name: "Gulab Jamun",
        category: "Syrup Based",
        price: 30,
        quantity: 100,
        description: "Soft, deep-fried berry-sized balls made of milk solids and flour soaked in rose flavored sugar syrup."
    },
    {
        name: "Kaju Katli",
        category: "Dry Fruit",
        price: 800,
        quantity: 50,
        description: "Diamond-shaped sweet made with cashew nuts, sugar, cardamom powder, and ghee butter."
    },
    {
        name: "Mysore Pak",
        category: "Ghee Based",
        price: 600,
        quantity: 40,
        description: "A rich sweet dish prepared in Ghee, from Southern India, usually served as dessert."
    },
    {
        name: "Rasgulla",
        category: "Bengali",
        price: 25,
        quantity: 150,
        description: "Ball-shaped dumplings of chhena (an Indian cottage cheese) and semolina dough, cooked in light syrup."
    },
    {
        name: "Motichoor Ladoo",
        category: "Ghee Based",
        price: 400,
        quantity: 75,
        description: "Round-shaped sweet made from fine, tiny balls of besan (gram flour) fried in ghee."
    },
    {
        name: "Jalebi",
        category: "Syrup Based",
        price: 300,
        quantity: 60,
        description: "Maida flour batter deep-fried in pretzel or circular shapes, which are then soaked in sugar syrup."
    },
    {
        name: "Kalakand",
        category: "Milk Based",
        price: 550,
        quantity: 30,
        description: "A rich milk cake made out of solidified, sweetened milk and paneer."
    },
    {
        name: "Soan Papdi",
        category: "Flour Based",
        price: 250,
        quantity: 100,
        description: "Cube-shaped crisp and flaky sweet with a distinct texture, made with gram flour, ghee, and sugar."
    }
];

const seedDB = async () => {
    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB...');

        // Clear existing data (Optional: comment this out if you want to keep old data)
        await Sweet.deleteMany({});
        console.log('🧹 Cleared existing sweets...');

        // Insert new data
        await Sweet.insertMany(sweets);
        console.log('🍬 Added sample sweets!');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
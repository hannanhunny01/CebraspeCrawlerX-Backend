const mongoose = require('mongoose');
const PasUnb = require('../models/pasunb');

const dbConnect = async () => {
    try {
        await mongoose.connect("url", { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

const addNewItemToPasUnb = async () => {
    try {
        await dbConnect();

        const allItems = await PasUnb.find({});

        for (const pas of allItems) {
            pas.items_on_site.push({ date: "01/01/2024 10:00", name: "test", link: "test" });
        }

        await Promise.all(allItems.map(item => item.save()));

        console.log('Items added successfully.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// Call the function to add items
// addNewItemToPasUnb();

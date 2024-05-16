const mongoose = require('mongoose');

// MongoDB URI
const uri = "mongodb+srv://abdullahkiet89:abdullahkiet89@data.kvgwgri.mongodb.net/Indoor_Positioning?retryWrites=true&w=majority";

async function connect() {
    try {
        await mongoose.connect(uri, {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function close() {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
}

module.exports = { connect, close };

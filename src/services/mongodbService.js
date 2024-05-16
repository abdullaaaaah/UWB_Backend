const { MongoClient } = require('mongodb');

// MongoDB URI
const uri = "mongodb+srv://abdullahkiet89:abdullahkiet89@data.kvgwgri.mongodb.net/UWB?retryWrites=true&w=majority";

// MongoClient instance
let client;

// Connect to MongoDB
async function connect() {
    try {
        if (!client) {
            client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            console.log('Connected to MongoDB');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Close MongoDB connection
async function close() {
    try {
        if (client) {
            await client.close();
            console.log('Disconnected from MongoDB');
            client = null;
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
}

// Function to store data
async function storeData(data) {
    try {
        await connect();
        const db = client.db("Indoor_Positioning");
        const collection = db.collection("data");
        await collection.insertOne(data);
        console.log('Data stored in MongoDB:', data);
    } catch (error) {
        throw error;
    }
}

async function getDataByTransmitterSerialNumber(serialNumber) {
    try {
        await connect();
        const db = client.db("Indoor_Positioning");
        const collection = db.collection("data");
        const result = await collection.find({ "transmitterSerialNumber": serialNumber })
            .sort({ "_id": -1 }) // Sort by timestamp in descending order
            .limit(1) // Limit the result to 1 document
            .toArray();
        return result[0]; // Return the first (and only) document
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        throw error;
    }
}
async function getMDataByTransmitterSerialNumber(serialNumber) {
    try {
        await connect();
        const db = client.db("Indoor_Positioning");
        const collection = db.collection("data");
        const result = await collection.findOne({ "transmitterSerialNumber": serialNumber,"allCount": { $gt: 1 } }, { sort: { "_id": -1 }, limit: 1 });
        
        if (!result) {
            return null; // No data found for the transmitter serial number
        }

        const reads = result.reads || []; // Get the reads array, or an empty array if it doesn't exist

        // Construct an array of objects containing deviceUID and distance
        const distances = reads.map(read => ({
            deviceUID: read.deviceUID,
            distance: read.distance
        }));

        return distances;
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        throw error;
    }
}

module.exports = { connect, close, storeData, getDataByTransmitterSerialNumber,getMDataByTransmitterSerialNumber };


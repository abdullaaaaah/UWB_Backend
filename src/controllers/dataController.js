const mongodbService = require('../services/mongodbService');

async function handleData(req, res) {
    try {
        const jsonData = req.body;
        // Check if jsonData is empty or not an object
        if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
          return res.status(400).send('Invalid JSON payload');
        }
    
        console.log('Received data via HTTP API:', jsonData);
        
        // Call the storeData function from mongodbService
        await mongodbService.storeData(jsonData);
        
        res.send('Data received successfully!');
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleData };

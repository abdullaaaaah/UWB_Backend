const mongodbService = require('../services/mongodbService');

async function handleData(req, res) {
    try {
        const jsonData = req.body;
        // Check if jsonData is empty or not an object
        if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
          return res.status(400).send('Invalid JSON payload');
        }
    
        console.log('Received data via HTTP API:', jsonData);

        // Check if jsonData is null
        if (!Object.keys(jsonData).length) {
          console.log('Data is null. Not storing in MongoDB.');
          return res.send('Data is null. Not storing in MongoDB.');
        }
        
        // Call the storeData function from mongodbService
        const result = await mongodbService.storeData(jsonData);

        // Send response based on the result of storing data
        if (result) {
          res.send('Data received and stored successfully!');
        } else {
          res.status(500).send('Failed to store data in MongoDB');
        }
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleData };

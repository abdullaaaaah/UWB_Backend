const mongodbService = require('../services/mongodbService');

async function handleDistance(req, res) {
    try {
        const { transmitterSerialNumbers } = req.body;
        // Check if transmitterSerialNumbers is provided and it's an array
        if (!transmitterSerialNumbers || !Array.isArray(transmitterSerialNumbers)) {
            return res.status(400).send('Transmitter serial numbers must be provided as an array');
        }

        // Fetch data from mongodbService based on the transmitterSerialNumbers
        const distances = [];
        for (const serialNumber of transmitterSerialNumbers) {
            const latestData = await mongodbService.getDataByTransmitterSerialNumber(serialNumber);
            const latestDistance = latestData ? latestData.distance : null;
            distances.push({ transmitterSerialNumber: serialNumber, distance: latestDistance });
        }

        res.json(distances);
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleDistance };

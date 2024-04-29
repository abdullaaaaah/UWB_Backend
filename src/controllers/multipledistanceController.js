const mongodbService = require('../services/mongodbService');

async function handleMultipleDistance(req, res) {
    try {
        const { transmitterSerialNumbers } = req.body;
        // Check if transmitterSerialNumbers is provided and it's an array
        if (!transmitterSerialNumbers || !Array.isArray(transmitterSerialNumbers)) {
            return res.status(400).send('Transmitter serial numbers must be provided as an array');
        }

        // Fetch data from mongodbService based on the transmitterSerialNumbers
        const distances = [];
        for (const serialNumber of transmitterSerialNumbers) {
            const jsonData = await mongodbService.getDataByTransmitterSerialNumber(serialNumber);
            if (!jsonData || !jsonData.reads || jsonData.reads.length === 0) {
                // If no data found for the transmitter serial number or no reads available, push null distance and count
                distances.push({ transmitterSerialNumber: serialNumber, tagData: [] });
            } else {
                // Find the latest read for the transmitter serial number
                const latestRead = jsonData.reads.reduce((acc, curr) => {
                    return (parseInt(acc.timeStampUTC) > parseInt(curr.timeStampUTC)) ? acc : curr;
                });

                // Push the latest distance and count for the transmitter serial number
                distances.push({ transmitterSerialNumber: serialNumber, tagData: [{ distance: latestRead.distance, count: latestRead.count }] });
            }
        }

        res.json(distances);
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleMultipleDistance };

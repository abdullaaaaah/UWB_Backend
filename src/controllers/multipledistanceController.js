const mongodbService = require('../services/mongodbService');

async function handleMultipleDistance(req, res) {
    try {
        const { transmitterSerialNumbers } = req.body;
        // Check if transmitterSerialNumbers is provided and it's an array
        if (!transmitterSerialNumbers || !Array.isArray(transmitterSerialNumbers)) {
            return res.status(400).send('Transmitter serial numbers must be provided as an array');
        }

        // Fetch data from mongodbService based on the transmitterSerialNumbers
        const allReads = [];
        let totalCount = 0; // Initialize total count

        for (const serialNumber of transmitterSerialNumbers) {
            const jsonData = await mongodbService.getDataByTransmitterSerialNumber(serialNumber);
            if (!jsonData || !jsonData.reads || jsonData.reads.length === 0) {
                // If no data found for the transmitter serial number or no reads available, continue to the next one
                continue;
            }

            // Push all reads for the transmitter serial number
            allReads.push(...jsonData.reads.map(read => ({
                deviceUID: read.deviceUID,
                distance: read.distance,
            })));

            // Increment total count by the number of reads for this transmitter serial number
            totalCount += jsonData.reads.length;
        }

        // Prepare response object
        const responseData = {
            reads: allReads,
            allCount: totalCount
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleMultipleDistance };

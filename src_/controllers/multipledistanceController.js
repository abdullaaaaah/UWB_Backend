const mongodbService = require('../services/mongodbService');

async function handleMultipleDistance(req, res) {
    try {
        const { transmitterSerialNumbers } = req.body;
        // Check if transmitterSerialNumbers is provided and it's an array
        if (!transmitterSerialNumbers || !Array.isArray(transmitterSerialNumbers)) {
            return res.status(400).send('Transmitter serial numbers must be provided as an array');
        }

        // Fetch latest data from mongodbService based on the transmitterSerialNumbers
        const transmittersData = [];

        for (const serialNumber of transmitterSerialNumbers) {
            const transmitterData = {
                transmitterSerialNum: serialNumber,
                data: []
            };

            const latestData = await mongodbService.getMDataByTransmitterSerialNumber(serialNumber);
            if (!latestData || !Array.isArray(latestData)) {
                // If no data found for the transmitter serial number or data is not an array, continue to the next one
                transmittersData.push(transmitterData);
                continue;
            }

            // Push the latest reads for the transmitter serial number
            latestData.forEach(dataItem => {
                transmitterData.data.push({
                    deviceUID: dataItem.deviceUID,
                    distance: dataItem.distance,
                });
            });

            transmittersData.push(transmitterData);
        }

        // Prepare response object
        const responseData = {
            transmitters: transmittersData
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleMultipleDistance };

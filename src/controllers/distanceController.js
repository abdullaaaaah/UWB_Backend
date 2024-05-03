async function handleDistance(req, res) {
    try {
        const { transmitterSerialNumbers } = req.body;
        // Check if transmitterSerialNumbers is provided and it's an array
        if (!transmitterSerialNumbers || !Array.isArray(transmitterSerialNumbers)) {
            return res.status(400).send('Transmitter serial numbers must be provided as an array');
        }

        // Fetch the latest inserted document for each transmitter serial number
        const distances = [];
        for (const serialNumber of transmitterSerialNumbers) {
            const latestDocument = await mongodbService.getLatestDataByTransmitterSerialNumber(serialNumber);
            if (!latestDocument) {
                // If no data found for the transmitter serial number, push null distance
                distances.push({ transmitterSerialNumber: serialNumber, distance: null });
            } else {
                // Push the distance from the latest inserted document
                distances.push({ transmitterSerialNumber: serialNumber, distance: latestDocument.distance });
            }
        }

        res.json(distances);
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleDistance };

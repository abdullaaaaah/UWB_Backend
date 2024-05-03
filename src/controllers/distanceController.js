// const mongodbService = require('../services/mongodbService');

// async function handleDistance(req, res) {
//     try {
//         const { transmitterSerialNumbers } = req.body;
//         // Check if transmitterSerialNumbers is provided and it's an array
//         if (!transmitterSerialNumbers || !Array.isArray(transmitterSerialNumbers)) {
//             return res.status(400).send('Transmitter serial numbers must be provided as an array');
//         }

//         // Fetch data from mongodbService based on the transmitterSerialNumbers
//         const distances = [];
//         for (const serialNumber of transmitterSerialNumbers) {
//             const jsonData = await mongodbService.getDataByTransmitterSerialNumber(serialNumber);
//             if (!jsonData) {
//                 // If no data found for the transmitter serial number, push null distance
//                 distances.push({ transmitterSerialNumber: serialNumber, distance: null });
//             } else {
//                 // Find the latest read for the transmitter serial number
//                 const latestRead = jsonData.reads.reduce((acc, curr) => {
//                     return (acc.timeStampUTC > curr.timeStampUTC) ? acc : curr;
//                 }, {});

//                 if (!latestRead) {
//                     // If no latest read found, push null distance
//                     distances.push({ transmitterSerialNumber: serialNumber, distance: null });
//                 } else {
//                     // Push the latest distance for the transmitter serial number
//                     distances.push({ transmitterSerialNumber: serialNumber, distance: latestRead.distance });
//                 }
//             }
//         }

//         res.json(distances);
//     } catch (error) {
//         console.error('Error handling data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// }

// module.exports = { handleDistance };
const { getDataByTransmitterSerialNumber } = require('../services/mongodbService');

async function handleDistance(req, res) {
    try {
        const { transmitterSerialNumbers } = req.body;
        // Check if transmitterSerialNumbers is provided and it's an array
        if (!transmitterSerialNumbers || !Array.isArray(transmitterSerialNumbers)) {
            return res.status(400).send('Transmitter serial numbers must be provided as an array');
        }

        const distances = [];
        for (const serialNumber of transmitterSerialNumbers) {
            try {
                const jsonData = await getDataByTransmitterSerialNumber(serialNumber);
                if (!jsonData) {
                    distances.push({ transmitterSerialNumber: serialNumber, distance: null });
                } else {
                    const latestRead = jsonData.reads.reduce((acc, curr) => {
                        return (acc.timeStampUTC > curr.timeStampUTC) ? acc : curr;
                    }, {});

                    distances.push({ transmitterSerialNumber: serialNumber, distance: latestRead ? latestRead.distance : null });
                }
            } catch (error) {
                console.error('Error handling data for transmitter serial number', serialNumber, ':', error);
                distances.push({ transmitterSerialNumber: serialNumber, distance: null });
            }
        }

        res.json(distances);
    } catch (error) {
        console.error('Error handling data:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleDistance };

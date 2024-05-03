// const mongodbService = require('../services/mongodbService');

// async function handleData(req, res) {
//     // Access data from the Request Payload
//     let data = '';
  
//     req.on('data', (chunk) => {
//       data += chunk;
//     });
  
//     req.on('end', async () => {
//       // Parse the data if it's JSON
//       let jsonData;
//       try {
//         jsonData = JSON.parse(data);
//       } catch (error) {
//         return res.status(400).send('Invalid JSON payload');
//       }
  
//       console.log('Received data via HTTP API:', jsonData);
  
//       // Check if allCount is greater than zero
//       if (jsonData.allCount > 0) {
//         try {
//           const result = await mongodbService.storeData(jsonData);
//           console.log('Data stored in MongoDB:', jsonData);
//         } catch (error) {
//           console.error('Error storing data in MongoDB:', error);
//           return res.status(500).send('Internal Server Error');
//         }
//       }
  
//       res.send('Data received successfully!');
//     });
// };

// module.exports = { handleData };
const moment = require('moment-timezone');
const mongodbService = require('../services/mongodbService');

async function handleData(req, res) {
    // Access data from the Request Payload
    let data = '';
  
    req.on('data', (chunk) => {
      data += chunk;
    });
  
    req.on('end', async () => {
      // Parse the data if it's JSON
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        return res.status(400).send('Invalid JSON payload');
      }
  
      console.log('Received data via HTTP API:', jsonData);
  
      // Check if allCount is greater than zero
      if (jsonData.allCount > 0) {
        try {
          // Convert timestamp to Pakistan Standard Time
          const readsWithPKT = jsonData.reads.map(read => ({
            ...read,
            timeStampPKT: moment.unix(read.timeStampUTC).tz('Asia/Karachi').format('YYYY-MM-DD HH:mm:ss')
          }));
  
          // Update jsonData with reads containing PKT timestamps
          jsonData.reads = readsWithPKT;
  
          const result = await mongodbService.storeData(jsonData);
          console.log('Data stored in MongoDB:', jsonData);
        } catch (error) {
          console.error('Error storing data in MongoDB:', error);
          return res.status(500).send('Internal Server Error');
        }
      }
  
      res.send('Data received successfully!');
    });
};

module.exports = { handleData };

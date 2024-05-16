const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const trilaterationRoutes = require('./routes/trilaterationRoutes');
const testRoutes = require('./routes/testRoutes');
const distanceRoutes = require('./routes/distanceRoutes');
const multipledistanceRoutes = require('./routes/multipleDistanceRoutes');
const multitrilaterationRoutes = require('./routes/multitrilaterationRoute');
const userRoutes = require('./routes/userRoutes');
const mongodbService = require("./services/mongodbService");
mongodbService.connect();
const app = express();
const port = process.env.PORT || 6611;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(dataRoutes);
app.use(trilaterationRoutes);
app.use(testRoutes);
app.use(distanceRoutes);
app.use(multipledistanceRoutes);
app.use(multitrilaterationRoutes);
app.use(userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

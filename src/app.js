const express = require('express');
const dataRoutes = require('./routes/dataRoutes');
const trilaterationRoutes = require('./routes/trilaterationRoutes');
const testRoutes = require('./routes/testRoutes');
const distanceRoutes = require('./routes/distanceRoutes');


const app = express();
const port = process.env.PORT || 6611;

app.use(express.json());
app.use(dataRoutes);
app.use(trilaterationRoutes);
app.use(testRoutes);
app.use(distanceRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

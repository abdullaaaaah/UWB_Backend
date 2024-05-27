const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const trilaterationRoutes = require('./routes/trilaterationRoutes');
const testRoutes = require('./routes/testRoutes');
const distanceRoutes = require('./routes/distanceRoutes');
const multipledistanceRoutes = require('./routes/multipleDistanceRoutes');
const multitrilaterationRoutes = require('./routes/multitrilaterationRoute');
const userRoutes = require('./routes/userRoutes');
const db = require("./services/db");
const app = express();
const port = process.env.PORT || 6611;
const siteRoutes = require('./routes/siteRoute');
const session = require('express-session');

// Connect to MongoDB
db.connect().catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the process if the connection fails
});

// Enable CORS for all routes
app.use(cors());
app.use(session({
    secret: 'helpmeout', // Add a secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set secure to true if using HTTPS
  }));
  
app.use(express.json());
app.use(dataRoutes);
app.use(trilaterationRoutes);
app.use(testRoutes);
app.use(distanceRoutes);
app.use(multipledistanceRoutes);
app.use(multitrilaterationRoutes);
app.use(userRoutes);
app.use(siteRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
// const dataRoutes = require('./routes/dataRoutes');
// const trilaterationRoutes = require('./routes/trilaterationRoutes');
// const testRoutes = require('./routes/testRoutes');
// const distanceRoutes = require('./routes/distanceRoutes');
// const multipledistanceRoutes = require('./routes/multipleDistanceRoutes');
// const multitrilaterationRoutes = require('./routes/multitrilaterationRoute');
// const userRoutes = require('./routes/userRoutes');
// const db = require("./services/db");

// db.connect();

// const app = express();
// const port = process.env.PORT || 6611;

// const uri = "mongodb+srv://abdullahkiet89:abdullahkiet89@data.kvgwgri.mongodb.net/UWB?retryWrites=true&w=majority";

// const store = new MongoDBStore({
//   uri: uri,
//   collection: 'sessions'
// });

// store.on('error', (error) => {
//   console.error('Session store error:', error);
// });

// app.use(cors());
// app.use(express.json());

// app.use(session({
//   secret: 'helpmeout', // Replace with a secure key
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24 // 1 day
//   }
// }));

// app.use(dataRoutes);
// app.use(trilaterationRoutes);
// app.use(testRoutes);
// app.use(distanceRoutes);
// app.use(multipledistanceRoutes);
// app.use(multitrilaterationRoutes);
// app.use(userRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user-routes');
const { initClickHouseClient } = require('./clickup');

const app = express();
const port = 3002;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Initialize ClickHouse client and set up routes
initClickHouseClient().then(client => {
    app.locals.clickhouseClient = client;
    app.use(userRoutes);

    // Start the server after the client has been initialized
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Error initializing ClickHouse client:', error);
    process.exit(1);
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Import routes
const routes = require('./routes'); // Adjust the path as necessary

// Use routes
app.use('/api', routes); // Base path for all API routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

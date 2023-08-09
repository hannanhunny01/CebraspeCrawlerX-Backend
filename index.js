const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 4000;
const app = express();

// Connect to the database
dbConnect();

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define a simple "hello" route


// Use the authRouter for handling user-related routes
app.use('/api/user', authRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

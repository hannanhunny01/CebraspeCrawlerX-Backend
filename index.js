const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');

const authRouter = require('./routes/authRoute');
const itemsRouter = require('./routes/itemsRoute')
const crawlerRouter = require('./routes/crawlerRoute')
const messageRouter = require('./routes/messageRoute')
const profilRoute = require('./routes/profileRoute')
const message = require('./routes/message')


const dotenv = require('dotenv').config();
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;
const app = express();



//let requestCounter = 0;

// Create a custom token for morgan to log the request count
//morgan.token('request-count', () => ++requestCounter);

// Use morgan middleware to log requests
//app.use(morgan(':method :url :status :response-time ms - Request #:request-count'));


const cors = require('cors')

dbConnect();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // If you need to include cookies in your requests
  }));

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// Use the authRouter for handling user-related routes
app.use('/api/user', authRouter);
app.use('/api/items',itemsRouter)
app.use('/api/crawler',crawlerRouter)
app.use('/api/sendMessage',messageRouter)
app.use('/api/profile',profilRoute)
app.use('/api/',message)

//morgan to see request in consolelog


// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

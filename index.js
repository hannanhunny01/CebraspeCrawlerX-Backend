const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const itemsRouter = require('./routes/itemsRoute')
const crawlerRouter = require('./routes/crawlerRoute')
const messageRouter = require('./routes/messageRoute')
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 4000;
const app = express();
const cors = require('cors')
// Connect to the database
dbConnect();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // If you need to include cookies in your requests
  }));
// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define a simple "hello" route


// Use the authRouter for handling user-related routes
app.use('/api/user', authRouter);
app.use('/api/items',itemsRouter)
app.use('/api/crawler',crawlerRouter)
app.use('/api/sendMessage',messageRouter)
// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

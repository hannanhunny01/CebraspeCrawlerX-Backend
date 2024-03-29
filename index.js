const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');
const path = require('path');


// Routes
const authRouter = require('./routes/authRoute');
const itemsRouter = require('./routes/itemsRoute')
const crawlerRouter = require('./routes/crawlerRoute')
const messageRouter = require('./routes/messageRoute')
const profilRoute = require('./routes/profileRoute')
const messageAndStatus = require('./routes/messageAndStatusRoute')


const dotenv = require('dotenv').config();
const morgan = require('morgan');

const {errorStatus} = require('./ErrorStatus/errorStatus')

 const schedulerQueue = require('./crawlerSchduler/quequeScheduler')
// schedulers
const cron = require('node-cron');
const {schedulerOne,schedulerTwo} = require('./crawlerSchduler/crawlerScheduler')
const {sendMessage} = require('./crawlerSchduler/messageScheduler')
const PORT = process.env.PORT || 4000;
const app = express();




// importing Queue




 //cron.schedule('*/1 * * * *', processQueue);


//let requestCounter = 0;

 //Create a custom token for morgan to log the request count
//morgan.token('request-count', () => ++requestCounter);

// Use morgan middleware to log requests
//app.use(morgan(':method :url :status :response-time ms - Request #:request-count'));


const cors = require('cors');
const req = require('express/lib/request');

dbConnect();
//app.use(cors({
  //  origin: 'http://localhost:5173',
   // credentials: true, // If you need to include cookies in your requests
////  }));


  app.use(cors({
    origin: '*',
    credentials: true, // If you need to include cookies in your requests
  }));

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static file hosting
const templatePath = path.join(__dirname, 'utils', 'templates', 'license');
app.use(express.static(templatePath));


// Use the authRouter for handling user-related routes
app.use('/api/user', authRouter);
app.use('/api/items',itemsRouter)
app.use('/api/crawler',crawlerRouter)
app.use('/api/sendMessage',messageRouter)
app.use('/api/profile',profilRoute)
app.use('/api/',messageAndStatus)



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});



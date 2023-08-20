const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");
const axios = require('axios');


const sendCrawlStatus = asyncHandler(async function (req,res){
     const msgdata = await  axios.get('http://localhost:4000/message')
     return res.json(msgdata.data)
})


module.exports = {sendCrawlStatus}


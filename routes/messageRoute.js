
const express = require('express');
const router = express.Router(); // Create an instance of Express Router


const {sendCrawlStatus} = require('../controller/sendMessage/sendcrawlStatus')

const {sendMessagePas} = require('../controller/sendMessage/sendMessagePas')



router.get('/pas',sendMessagePas)

module.exports = router
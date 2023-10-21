
const express = require('express');
const router = express.Router(); 


const {sendCrawlStatus} = require('../controller/sendMessage/sendcrawlStatus')

const {sendMessagePas} = require('../controller/sendMessage/sendMessagePas')
const {sendMessageConcurso} = require('../controller/sendMessage/sendMessageConcurso')
const {sendMessageVest} = require('../controller/sendMessage/sendMessageVest')

router.get('/pas',sendMessagePas)
router.get('/concurso',sendMessageConcurso)
router.get('/vest',sendMessageVest)
module.exports = router
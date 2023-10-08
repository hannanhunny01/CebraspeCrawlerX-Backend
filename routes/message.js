
const express = require('express');
const router = express.Router();
const {sendMessage} = require('../controller/message/sendMessage')
router.post('/message',sendMessage);

module.exports = router;

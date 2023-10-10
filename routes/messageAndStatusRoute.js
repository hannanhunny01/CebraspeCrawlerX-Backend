
const express = require('express');

const router = express.Router();
const {sendMessage} = require('../controller/messageAndStatus/sendMessage')
const {updateStatus,cacheMiddleware,getSystemStatus} = require('../controller/messageAndStatus/updateStatus')

router.post('/message',sendMessage);
router.post('/updateStatus',async(req,res)=>{
     updateStatus(req.body.status,req.body.action,Date.now())
     return res.json({message:"done"})
})

router.get('/status',cacheMiddleware,getSystemStatus)

module.exports = router;

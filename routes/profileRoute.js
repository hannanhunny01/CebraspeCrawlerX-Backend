const express = require('express')
const router  = express.Router()
const {tokenValidator} = require('../middleware/tokenValidadtor')

const {registerNewProfile,updateNotifications,sendUserProfile} = require('../controller/profileSetup/profileSetup')
const {sendCode} = require('../controller/profileSetup/sendCode')

router.post('/updateNotifications',tokenValidator,updateNotifications)
router.post('/registerProfile',tokenValidator,registerNewProfile)
router.get('/sendUserProfile',tokenValidator,sendUserProfile)
router.post('/sendCode',tokenValidator,sendCode);
module.exports = router
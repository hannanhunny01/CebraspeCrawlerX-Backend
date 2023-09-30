const express = require('express')
const router  = express.Router()
const {tokenValidator} = require('../middleware/tokenValidadtor')

const {registerNewProfile,updateNotifications,sendUserProfile} = require('../controller/profileSetup/profileSetup')
const {sendCode,verifyCodeTelegram} = require('../controller/profileSetup/sendCode')
const { adminProtect } = require('../middleware/adminProtect')
const { makeLicense, checkLicense } = require('../controller/profileSetup/licenses')

router.post('/updateNotifications',tokenValidator,updateNotifications)
router.post('/registerProfile',tokenValidator,registerNewProfile)
router.get('/sendUserProfile',tokenValidator,sendUserProfile)
router.post('/sendCode',tokenValidator,sendCode);
router.post('/verifyTelegram' ,tokenValidator,verifyCodeTelegram)
router.post('/registerLicense',adminProtect,makeLicense);
router.post('/verifyLicense',tokenValidator,checkLicense);
module.exports = router
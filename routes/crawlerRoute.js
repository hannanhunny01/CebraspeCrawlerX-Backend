const express = require('express');
const router = express.Router(); // Create an instance of Express Router

// middlewares
const {tokenValidator} = require('../middleware/tokenValidadtor')
const {adminProtect} =require('../middleware/adminProtect')

const {pasMainPage,updatePasOnDatabase,pasPagesCrawler} = require ('../controller/crawlers/pasCrawler')

// functions

router.get("/getMainPas/" ,pasMainPage)
router.get("/crawlingModePas/" ,pasMainPage,updatePasOnDatabase)
router.get("/crawlingEachPas",pasPagesCrawler)
module.exports = router;
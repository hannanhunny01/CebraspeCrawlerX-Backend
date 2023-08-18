const express = require('express');
const router = express.Router(); // Create an instance of Express Router

// middlewares
const {tokenValidator} = require('../middleware/tokenValidadtor')
const {adminProtect} =require('../middleware/adminProtect')

const {pasMainPage,updatePasOnDatabase,pasPagesCrawler} = require ('../controller/crawlers/pasCrawler')

const {vestMainPage,updateVesOnDatabase,vestPagesCrawler} = require('../controller/crawlers/vestCrawler')


// functions
// pas crawlers
router.get("/getMainPas/" ,pasMainPage)
router.get("/crawlingModePas/" ,pasMainPage,updatePasOnDatabase)
router.get("/crawlingEachPas",pasPagesCrawler)

// vest crawlers
router.get("/crawlingModeVes/" ,vestMainPage,updateVesOnDatabase)
router.get("/crawlingEachVest/" ,vestPagesCrawler)

module.exports = router;
const express = require('express');
const router = express.Router(); // Create an instance of Express Router

// middlewares
const {tokenValidator} = require('../middleware/tokenValidadtor')
const {adminProtect} =require('../middleware/adminProtect')

const {pasMainPage,updatePasOnDatabase,pasPagesCrawler} = require ('../controller/crawlers/pasCrawler')

const {vestMainPage,updateVesOnDatabase,vestPagesCrawler} = require('../controller/crawlers/vestCrawler')
const {conMainPage,updateConOnDatabase,conPagesCrawler} = require('../controller/crawlers/concursoCrawler')

// functions
// pas crawlers
router.get("/getMainPas/" ,pasMainPage)
router.get("/crawlingModePas/" ,pasMainPage,updatePasOnDatabase)
router.get("/crawlingEachPas",pasPagesCrawler)

// vest crawlers
router.get("/crawlingModeVes/" ,vestMainPage,updateVesOnDatabase)
router.get("/crawlingEachVest/" ,vestPagesCrawler)


//concurso routes
router.get("/crawlingModeCon/" ,conMainPage,updateConOnDatabase)
router.get("/crawlingEachCon/",conPagesCrawler)
module.exports = router;
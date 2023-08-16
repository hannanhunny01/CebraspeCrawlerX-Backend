const express = require('express');
const router = express.Router(); // Create an instance of Express Router

// middlewares
const {tokenValidator} = require('../middleware/tokenValidadtor')
const {adminProtect} =require('../middleware/adminProtect')


// functions
const {getAllPas,getMyPas,registerPasUser,deltePasByUser} = require('../controller/items/pasController')

router.get('/getPas',tokenValidator,getAllPas)
router.get('/getMyPas',tokenValidator,getMyPas)
router.post('/registerPas',tokenValidator,registerPasUser)
router.delete('/deltePasByUser',tokenValidator,deltePasByUser)
module.exports = router;

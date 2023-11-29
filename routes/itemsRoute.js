const express = require('express');
const router = express.Router(); // Create an instance of Express Router

// middlewares
const {tokenValidator} = require('../middleware/tokenValidadtor')
const {adminProtect} =require('../middleware/adminProtect')
const { checkAccount } = require('../middleware/checkAccount')

// functions
const {getAllPas,getMyPas,registerPasUser,deltePasByUser} = require('../controller/items/pasController')
const {getAllCon,getMyCon,registerConUser,delteConByUser} = require('../controller/items/conController')
const {getAllVest,getMyVest,registerVestUser,delteVestByUser} = require('../controller/items/vestController')

// pas items controller
router.get('/getPas',tokenValidator,getAllPas)
router.get('/getMyPas',tokenValidator,getMyPas)
router.post('/registerPas',tokenValidator,checkAccount,registerPasUser)
router.delete('/deltePasByUser',tokenValidator,deltePasByUser)


// concurso items controller

router.get('/getConcurso',tokenValidator,getAllCon)
router.get('/getMyConcurso',tokenValidator,getMyCon)
router.post('/registerConcurso',tokenValidator,checkAccount,registerConUser)
router.delete('/delteConcursoByUser',tokenValidator,delteConByUser)



// vestibular items controller
router.get('/getVestibular',tokenValidator,getAllVest)
router.get('/getMyVestibular',tokenValidator,getMyVest)
router.post('/registerVestibular',tokenValidator,checkAccount,registerVestUser)
router.delete('/delteVestibularByUser',tokenValidator,delteVestByUser)


module.exports = router;

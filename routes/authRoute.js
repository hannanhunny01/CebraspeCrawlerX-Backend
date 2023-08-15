const express = require('express');
const router = express.Router(); // Create an instance of Express Router
const {createUser} = require('../controller/user/createUser');
const {checkUser} = require('../controller/user/checkUser')
const {loginUser} = require('../controller/user/loginUser')
const {forgotPassword ,resetPassword ,updatePassword} = require('../controller/user/passwordUser')
const {tokenValidator} = require('../middleware/tokenValidadtor')
const {adminProtect} =require('../middleware/adminProtect')

function checkid(req,res){
  return res.json({'hello':req.params.id })
}

router.post('/register', createUser);
router.post('/login',loginUser)

router.get('/checkUser',checkUser)

router.post('/checktoken',tokenValidator)

router.post('/admintoken',adminProtect)

router.post('/forgotPassword' ,forgotPassword)

router.patch('/resetPassword/:token' ,resetPassword)

router.patch('/changepassword',tokenValidator,updatePassword)
// Export the router
module.exports = router;

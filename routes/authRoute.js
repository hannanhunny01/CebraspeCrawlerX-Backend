const express = require('express');
const router = express.Router(); // Create an instance of Express Router
const {createUser} = require('../controller/user/createUser');
const {checkUser} = require('../controller/user/checkUser')

function checkid(req,res){
  return res.json({'hello':req.params.id })
}

router.post('/register', createUser);
router.post('/login',checkUser)
router.get('/check/:id',checkid)
// Export the router
module.exports = router;

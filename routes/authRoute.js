const express = require('express');
const router = express.Router(); // Create an instance of Express Router
const {createUser} = require('../controller/user/createUser');
const {checkUser} = require('../controller/user/checkUser')



router.post('/register', createUser);
router.post('/login',checkUser)
// Export the router
module.exports = router;

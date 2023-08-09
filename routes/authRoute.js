const express = require('express');
const router = express.Router(); // Create an instance of Express Router
const {createUser} = require('../controller/user/createUser');

// Define the /register route using the router
router.post('/register', createUser);

// Export the router
module.exports = router;

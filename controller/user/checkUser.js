const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");



const checkUser = asyncHandler(async (req, res) => {
 
    const email = req.body.email;
    const password = req.body.password

  
    const findUser = await User.findOne({ email: email ,password:password  });
    
    if (findUser) {
   
      res.json(" logged in with Sucess");
    } else {
      
      return res.status(400).json('invalid Credentials')

    }
  });


module.exports={checkUser};
const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");



const checkUser = asyncHandler(async (req, res) => {
 
    const email = req.body.email;

  
    const findUser = await User.findOne({ email: email});
    
    if (findUser) {
   
      res.status(401).json("User Already Exist");
    } else {
      
      return res.status(200).json('All Good')

    }
  });


module.exports={checkUser};
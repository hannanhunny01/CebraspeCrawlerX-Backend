const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");



const checkUser = asyncHandler(async (req, res) => {
 
    const email = req.body.email;
    const phone = req.body.phone;
  
    const findUserEmail = await User.findOne({ email: email});
    
    if (findUserEmail) {
   
      res.status(401).json({message:"User Already Exist"});
    } else {
      
      return res.status(200).json({message:'All Good'})

    }
  });


module.exports={checkUser};
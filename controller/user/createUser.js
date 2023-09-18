//const User = require('../../models/userModel')

const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const {checkCode} = require('../profileSetup/sendCode')
const createUser = asyncHandler(async (req, res) => {
    /**
     * TODO:Get the email from req.body
     */
    const email = req.body.email;
    /**
     * TODO:With the help of email find the user exists or not
     */
    const findUser = await User.findOne({ email: email });
    
    if (!findUser) {
      /**
       * TODO:if user not found user create a new user
       */
      if(await checkCode(req.body.email,req.body.code)){
        
         const {username,email,password} = req.body
        const newUser = await User.create({username,email,password});
        const token = jwt.sign({id: newUser._id} , process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});

         return res.status(200).json({message:"Regsitered SucessFully"})
        res.json(
          {status:'success',
          token,
          data:{
            user:newUser
          }
      }
      );
      } else {
       
        return res.status(401).json({message:"invalid code"})
        throw new Error("User Already Exists");
      }


      }
      return res.status(401).json({message:"User already Exist"})
   
  });


module.exports={createUser};
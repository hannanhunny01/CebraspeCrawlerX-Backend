//const User = require('../../models/userModel')

const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const {checkCode} = require('./sendCode')
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
      if(checkCode(req.body.phone,req.body.code)){

        const newUser = await User.create(req.body);
        const token = jwt.sign({id: newUser._id} , process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        console.log('hello')
        res.json(
          {status:'success',
          token,
          data:{
            user:newUser
          }
      }
      );
      } else {
        /**
         * TODO:if user found then thow an error: User already exists
         */
        throw new Error("User Already Exists");
      }


      }
   
  });


module.exports={createUser};
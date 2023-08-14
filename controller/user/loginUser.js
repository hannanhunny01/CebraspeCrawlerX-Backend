const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')


const signToken = (id) =>{
   return  jwt.sign({id} , process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
     
}

const loginUser = asyncHandler( async function (req,res){
          
    const {email,password} = req.body;

    if ( !email || !password){
        return next(new Error('please privide email and password' ,400))
        }
    const user = await User.findOne({email})
    console.log(user)
    const correct = await user.correctPassword(password,user.password)
    
    if (!user || !correct){
        return next(new Error("invalis email or password" ,401))
    }

    const token = signToken(user._id)

    res.status(200).json({
        status:"success",
        token:token
    })
})

module.exports ={loginUser}
const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')


const signToken = (id) =>{
   return  jwt.sign({id} , process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
     
}

const loginUser = asyncHandler( async function (req,res){
          
    const {email,password} = req.body;

    if ( !email || !password){
        return res.status(401).json({message:"Dados Vazios"})
        }
    const user = await User.findOne({email})
    if (!user){

        return res.status(401).json({message:"Usuario nao existe"})
    }
   
    const correct = await user.correctPassword(password,user.password)
    
    if (!correct){
        return res.status(401).json({message:"Senha Invalido"})
    }

    const token = signToken(user._id)
    
    res.status(200).json({
        message:"Login Sucessfull",
        token:token
    })
})

module.exports ={loginUser}
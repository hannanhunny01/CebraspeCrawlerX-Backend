const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");



const forgotPassword = asyncHandler(async (req, res) => {
   
    try{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(404).json({message:"User not Found"});
    }
    const resetToken = user.createPasswordResetToken()
    await user.save()

    return res.json(user)}
    catch(error){
        return res.status(401).json({ message: 'Invalid or Empty email' });
    }

})


const resetPassword = asyncHandler(async (req, res) => {})
module.exports ={forgotPassword ,resetPassword}
const User = require('../../models/userModel')
const asyncHandler = require("express-async-handler");
const crypto = require('crypto')
const {sendEmail} = require('../../utils/email');
const { response } = require('express');

const forgotPassword = asyncHandler(async (req, res) => {
   
    try{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(404).json({message:"User not Found"});
    }
    const resetToken = user.createPasswordResetToken()
    await user.save()

    const resetUrl =`${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}`

    const message = `forgot your password reset your password on  ${resetUrl}`
    await sendEmail({
        email:user.email,
        subject:"you password reset token valid for 10 minutes",
        message 
    })
    return res.status(200).json({message:"message sent sucessfully"})}
    catch(error){
        console.log(error)
        return res.status(401).json({ message: 'Invalid or Empty email' });
    }

})


const resetPassword = asyncHandler(async (req, res ) => {
  try{

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken:hashedToken ,passwordResetExpire:{$gt:Date.now()}})

    if(!user){

        return res.status(401).json({message:"token expired"})
    }

    user.password = req.body.password

    user.passwordResetExpire = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    return res.json(user)



  }catch(error){
    console.log(error)
   return res.status(401).json({message:"invalid Credentials"})
  }


})

const updatePassword = asyncHandler(async (req, res ) => {
    try{
        const user = await User.findById(req.id)
        const correct = await user.correctPassword(req.body.password,user.password)
        if(correct){
            user.password = req.body.newpassword
            user.save()
            return res.status(200).json({message:"updated sucessfully"})
        }

        return res.status(401).json({message:"invalid"})






    }catch(error){
        console.log(error)
        return res.json({message:"error"})
    }})



module.exports ={forgotPassword ,resetPassword ,updatePassword}
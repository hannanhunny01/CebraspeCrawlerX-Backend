const User = require('../../models/userModel');
const CodeSaver = require('../../models/codeSaver');
const {checkCode} = require('../user/sendCode')


const registerNewProfile = async (req, res) => {
  try {
    if (req.body.contactMethod) {
      if(checkCode(req.body.contactMethod,req.body.contactValue,req.body.verificationCode)){      
        const user = await User.findById(req.id);

        if (user) {
          const method = req.body.contactMethod;
          user[method] = req.body.contactValue;
          if(contactMethod === "phone"){
            user.phoneNotifications = true    
          }else if(contactMethod ==="email") {
            user.emailNotifications = true   
          }else{
             user.telegramNotifications = true   
          }
          await user.save();
          return res.status(200).json({ message: 'Profile updated successfully' });
        } else {
          return res.status(404).json({ error: 'User not found' });
        }
      } else {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
    } else {
      return res.status(400).json({ error: 'Identity not provided' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const updateNotifications = async (req,res) =>{
   
  try{
    const user = await User.findById(req.id);
    const contactMethod = req.body.contactMethod
    if(user && contactMethod in user){
      if(contactMethod === "phone"){
        user.phoneNotifications = req.body.newValue

      }else if(contactMethod ==="email") {
        user.emailNotifications = req.body.newValue

      }else{
         user.telegramNotifications = req.body.newValue

      }
      await user.save();
       return res.status(200).json({message:"Updated SucessFully"});
       

    }else{

      return res.status(401).json({message:"Register First"})
    }




  }catch(error){console.log(error)}


}

module.exports = registerNewProfile;

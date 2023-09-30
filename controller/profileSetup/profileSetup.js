const User = require('../../models/userModel');
const CodeSaver = require('../../models/codeSaver');
const {checkCode} = require('./sendCode')





const sendUserProfile = async (req,res)=>{
  try{
    const user = await User.findById(req.id);
    if (user){
       const items =[]
       if ( user.telegram ){
        items.push({
            name:"Telegram",
            value:user.telegram,
            status:user.telegramNotifications})
       }else{
        items.push({
          name:"Telegram",
          value:null,
          status:user.telegramNotifications})
       }
       if(user.phone ){
        items.push({
        name:"Whatsapp",
        value:user.phone,
        status:user.phoneNotifications})
       }else{
        items.push({
          name:"Whatsapp",
          value:null,
          status:user.phoneNotifications})
       }
       if( user.email ){
        
        items.push({
        name:"Email",
        value:user.email,
        status:user.emailNotifications
      })
       }

       return res.status(200).json({
        name:user.username,
        items:items})






    }


  }catch(error){
    console.log(error)
  }
}
const registerNewProfile = async (req, res) => {
  try {
    if (req.body.contactMethod) {
      if(checkCode(req.body.contactMethod,req.body.contactValue,req.body.verificationCode)){      
        const user = await User.findById(req.id);
        if (user) {
          const method = req.body.contactMethod;
          user[method] = req.body.contactValue;
          if(method === "phone"){
            user.phoneNotifications = true    
          }else if(method ==="email") {
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
        if(user.phone){
          user.phoneNotifications = req.body.newValue
        }else{
            return res.status(401).json({message:"Você precisa se registrar primeiro para ativar as notificações"});

        }
        

      }else if(contactMethod ==="email") {
        if(user.email){
          user.emailNotifications = req.body.newValue

        }else{
          return res.status(401).json({message:"Você precisa se registrar primeiro para ativar as notificações"});

      }

      }else {
        if(user.telegram){
          user.telegramNotifications = req.body.newValue
        }else{
          return res.status(401).json({message:"Você precisa se registrar primeiro para ativar as notificações"});

      }
        

      }
      await user.save();
       return res.status(200).json({message:"Atualizado com Sucesso"});
       

    }else{

      return res.status(401).json({message:"Você precisa se registrar primeiro para ativar as notificações"})
    }




  }catch(error){console.log(error)}


}

module.exports = {registerNewProfile,updateNotifications,sendUserProfile};

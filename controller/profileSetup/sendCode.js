const User = require('../../models/userModel');
const CodeSaver = require('../../models/codeSaver');
const axios = require('axios')


const sendCode = async (req,res) =>{

     try{
    const contactMethod = req.body.contactMethod
    const contactValue  = req.body.contactValue
    console.log(contactMethod,contactValue ,"hello")
    const checkStatus = await CodeSaver.findOne({contactMethod:contactMethod,contactValue:contactValue})
    
    if(!checkStatus){
    const sendRequest = await axios.post('http://localhost:4000/api/code/sendCode', { contactMethod ,contactValue });
    if(sendRequest.data.code){
        const verification = new CodeSaver({
            contactMethod:contactMethod,
            contactValue:contactValue,
            verificationCode:sendRequest.data.code         
          });
          console.log(verification)
      

          await verification.save();
        return res.status(201).json({message:"Mesagem enviada com Sucesso!"})

    }
  }else{
    return res.status(200).json({message:"Codigo ja enviada para este email espera um pouco para mandar novamente"})
  }

    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }



}


const verifyCodeTelegram = async (req,res)=>{


  try{
    const user = await User.findById(req.id)

    const code   = req.body.code



    const requestOptions={
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body: JSON.stringify({
        
        code:code
         

      })
    }
   
    const response = await fetch('http://localhost:4000/api/code/verifyTelegram', requestOptions);
    const data = await response.json()
    if(response.ok){
      if(user){
        user.telegram = data.chatId;
        user.telegramNotifications = true;
        await user.save();
      }

      return res.status(200).json({message:"Updated SucessFully"})
    }
  

    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}

const checkCode = async  function(contactMethod ,contactValue,code){
  try{
    
    const getValue = await CodeSaver.findOne({contactMethod:contactMethod,contactValue:contactValue})
    if (getValue.verificationCode == code){
      return true
    }else{
      return false
    }
    


  }catch(error){
    console.log(error)
  }


}

module.exports = {sendCode ,checkCode,verifyCodeTelegram}
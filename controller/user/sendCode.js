const User = require('../../models/userModel');
const CodeSaver = require('../../models/codeSaver');
const axios = require('axios')


const sendCode = async (req,res) =>{

     try{
    const contactMethod = req.body.contactMethod
    const contactValue  = req.body.contactValue

    const checkStatus = await CodeSaver.findOne({contactMethod:contactMethod,contactValue:contactValue})
    
    if(!checkStatus){
    const sendRequest = await axios.post('http://localhost:4000/sendCode', { contactMethod ,contactValue });
    if(sendRequest.data.code){
        const verification = new CodeSaver({
            contactMethod:contactMethod,
            contactValue:contactValue,
            verificationCode:sendRequest.data.code         
          });
      
          // Save the verification document to the database
          await verification.save();
        return res.status(200).json({message:"Mesagem enviada com Sucesso!"})

    }
  }else{
    return res.status(401).json({message:"Message already sended wait to send Again"})
  }

    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }



}

const checkCode = async  function(contactMethod ,contactValue,code){
  try{
    
    const getValue = await CodeSaver.findOne({contactMethod:contactMethod,contactValue:contactValue})
    if (getPhone.verificationCode == code){
      return true
    }else{
      return false
    }
    


  }catch(error){
    console.log(error)
  }


}

module.exports = {sendCode ,checkCode}
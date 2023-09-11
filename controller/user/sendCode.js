const User = require('../../models/userModel');
const CodeSaver = require('../../models/codeSaver');
const axios = require('axios')


const sendCode = async (req,res) =>{

     try{
    const number = req.body.phone

    const checkNumber = await CodeSaver.findOne({phoneNumber:number})
    
    if(!checkNumber){
    const sendRequest = await axios.post('http://localhost:4000/sendCode', { number });
    if(sendRequest.data.code){
        const verification = new CodeSaver({
            phoneNumber: sendRequest.data.phone,
            verificationCode: sendRequest.data.code
          });
      
          // Save the verification document to the database
          await verification.save();
        return res.status(200).json({message:"Mesagem enviada com Sucesso!"})

    }
  }

    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }



}

const checkCode = async  function(phone ,code){
  try{

    const getPhone = await CodeSaver.findOne({phoneNumber:phone})
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
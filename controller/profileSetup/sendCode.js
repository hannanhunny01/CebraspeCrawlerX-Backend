const User = require('../../models/userModel');
const CodeSaver = require('../../models/codeSaver');
const axios = require('axios')



const checkIfExist = async (contactMethod, contactValue) => {
  try {
    const users = await User.find({ [contactMethod]: contactValue });
    if(users.length > 0){
      return true
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const sendCode = async (req, res) => {

  try {
    const contactMethod = req.body.contactMethod
    const contactValue = req.body.contactValue
    if(await checkIfExist(contactMethod, contactValue)){
      return res.status(400).json({message:"Este contato ja esta cadastrado"})
    }

    const checkStatus = await CodeSaver.findOne({ contactMethod: contactMethod, contactValue: contactValue })

    if (!checkStatus) {
      const sendRequest = await axios.post(`${process.env.MICROSERIVCE_URL}/api/code/sendCode`, { contactMethod, contactValue });
      if (sendRequest.data.code) {
        const verification = new CodeSaver({
          contactMethod: contactMethod,
          contactValue: contactValue,
          verificationCode: sendRequest.data.code
        });


        await verification.save();
        return res.status(201).json({ message: "Mesagem enviada com Sucesso!" })

      }
    } else {
      return res.status(200).json({ message: "Codigo ja enviada para este email espera um pouco para mandar novamente" })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "internal server error" })
  }



}


const verifyCodeTelegram = async (req, res) => {


  try {
    const user = await User.findById(req.id)

    const code = req.body.code

    

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({

        code: code


      })
    }

    const response = await fetch(`${process.env.MICROSERIVCE_URL}/api/code/verifyTelegram`, requestOptions);
    const data = await response.json()
    if (response.ok) {
      if(await checkIfExist("telegram", data.chatId)){
           return res.status(400).json({message:"Este contato ja esta cadastrado"})
      }
      if (user) {
        user.telegram = data.chatId;
        user.telegramNotifications = true;
        await user.save();
      }

      return res.status(200).json({ message: "Updated SucessFully" })
    }


  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "internal server error" })
  }
}

const checkCode = async function (contactMethod, contactValue, code) {
  try {

    const getValue = await CodeSaver.findOne({ contactMethod: contactMethod, contactValue: contactValue })
    if (getValue.verificationCode == code) {
      return true
    } else {
      return false
    }



  } catch (error) {
    console.log(error)
  }


}

module.exports = { sendCode, checkCode, verifyCodeTelegram }
const License = require("../../models/license");
const User = require('../../models/userModel')

const {sendEmail}= require('../../utils/email')



function generateRandomKey(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    key += charset.charAt(randomIndex);
  }

  return key;
} 



const makeLicense = async (req,res) =>{

  try{
    const email = req.body.email;
    const findUser = await User.findOne({email:email})
    console.log(findUser);
    if (findUser){


    const issuedBy = req.username;
    const issueDate = new Date();


    let isUnique = false;
    let newKey;
    while(!isUnique){
        newKey = generateRandomKey(15);

        const checkLicense = await License.findOne({licenseKey:newKey})
        if(!checkLicense){
          isUnique= true;
        }
    }    

    const newLicense = await License.create({licenseKey:newKey,issuedTo:findUser.id,issuedBy:issuedBy,issueDate:issueDate});
    await newLicense.save() 
    await sendEmail({
        email:email,
        subject:"Chave de Licenca para Cadastrar no Whatsapp ",
        message:`Foi criado um chave de Acesso para Cadastrar no Servico de Whatsapp \n este Chave foi criado Exculsivamente para sua conta .Entao so funcionaria oara voce
            \n esse o Chave \n  ${newLicense.licenseKey}` 
    })

    return res.status(200).json({message:"Chave criado e enviado para usuario com sucesso"});



    }else{
        return res.status(400).json({message:"Email provided doesn't have any account associated with it"});

    }

  }catch(error){
    console.log(error);
  }



}


const checkLicense = async (req,res) =>{

    try{

        const license = await License.findOne({issuedTo:req.id})
        if (license && req.body.accessKey === license.licenseKey ){

          return res.status(200).json({message:"Chave verificada com Sucesso"}) 

        }else{

            return res.status(401).json({message:"Chave Invalida ou errada"});
        }
       



    }catch(error){
        console.log(error)
    }
}

module.exports = {checkLicense,makeLicense}
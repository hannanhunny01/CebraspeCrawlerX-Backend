const License = require("../../models/license");
const User = require('../../models/userModel')
const fs = require('fs');
const path = require('path');


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
    const licenseTemplatePath = path.join(__dirname, '../../utils/templates/license/index.html');
    let licenseTemplate = fs.readFileSync(licenseTemplatePath, 'utf-8'); 
    licenseTemplate = licenseTemplate.replace('{{code}}', newLicense.licenseKey);

    await sendEmail({
        email:email,
        subject:"Chave de Licenca para Cadastrar no Whatsapp ",
        html:licenseTemplate
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
        console.log(req.body , req.id)

        const license = await License.find({issuedTo:req.id})
        for( const item of license){
         if(item.licenseKey === req.body.accessToken){

          return res.status(200).json({message:"Chave verificada com Sucesso"}) 

        }
        }
          return res.status(401).json({message:"Chave Invalida ou errada"});
  

              


    }catch(error){
        console.log(error)
    }
}

module.exports = {checkLicense,makeLicense}
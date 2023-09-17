
const User = require('../../models/userModel')

const sendRequest = async(type){
    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type":"Aplication/json"
        },
        body:JSON.stringify({
            whatsapp:req.body.number
        })


    }

    const response = await fetch("http://localhost:4000/sendCode",requestOptions)
    




}

const registerZap = async (req,res)=>{


    try{

        const user = await User.findById(req.id)
        if (user){
           
             
        }


    }catch(error){


    }
}
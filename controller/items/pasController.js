const PasUnb = require('../../models/pasunb')
const User = require('../../models/userModel')

const asyncHandler = require("express-async-handler");


const getAllPas = asyncHandler(async function (req,res){
    try{
      const allPasObject = await PasUnb.find({})
      return res.status(200).json(allPasObject)
    }catch(error){
        console.log(error)
    }
})


const getMyPas = asyncHandler(async function (req, res) {
  try {
    const user = await User.findById(req.id);
    
    if (user) {
      const pasObj = [];

      console.log(user.pasUnb);

      for (const item of user.pasUnb) {
        
        const userPasItem = await PasUnb.findById(item); // Add await here
        const selectedFields = {
          _id: userPasItem._id,
          subprograma: userPasItem.subprograma,
          stage_pas: userPasItem.stage_pas,
          year_pas: userPasItem.year_pas,
          link_to_site: userPasItem.link_to_site,
        };
        pasObj.push(selectedFields);
      }

     

      return res.json(pasObj); // Return the actual array, not a string
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


 const registerPasUser = asyncHandler(async function (req, res) {
  try {
    const user = await User.findById(req.id)
    if(!user.pasUnb.includes(req.body.pasId)){
      user.pasUnb.push(req.body.pasId);
      await user.save()
    }
    
  
    const pas = await PasUnb.findById(req.body.pasId)
    if(!pas.users.includes(req.id)){
      pas.users.push(user.id)
      await pas.save()
    }
   
    return res.status(200).json({message:"registered SucessFully"})


  }catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server Error" });
  }})

  const deltePasByUser = asyncHandler(async function (req, res) {
    try {
      const user = await User.findById(req.id)

      if(user.pasUnb.includes(req.body.pasId)){
        user.pasUnb.pull(req.body.pasId);
        await user.save()
      }
      
    
      const pas = await PasUnb.findById(req.body.pasId)
      if(pas.users.includes(req.id)){
        pas.users.pull(user.id)
        await pas.save()
      }
     
  
      return res.status(200).json({message:"deleted SucessFully"})
  
  
    }catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server Error" });
    }})


module.exports = {getAllPas,getMyPas,registerPasUser,deltePasByUser}
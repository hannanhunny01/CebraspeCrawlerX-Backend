const VestUnb = require('../../models/vestibular')
const User = require('../../models/userModel')

const asyncHandler = require("express-async-handler");


const getAllVest = asyncHandler(async function (req,res){
    try{
      const allVestObject = await VestUnb.find({})

      const modifiedObjects = allVestObject.map(obj => {
        const { items_on_site, users,items_on_site_number, ...rest } = obj._doc;
        return rest; 
      });
      return res.status(200).json(modifiedObjects)
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server Error"})
    }
})


const getMyVest = asyncHandler(async function (req, res) {
  try {
    const user = await User.findById(req.id);
    
    if (user) {
      const vestObj = [];

      for (const item of user.vestUnb) {
        
        const userVestItem = await VestUnb.findById(item); // Add await here
        const selectedFields = {
          _id: userVestItem._id,
          name: userVestItem.name, 
          link_to_site: userVestItem.link_to_site,
        };
        vestObj.push(selectedFields);
      }

     

      return res.status(200).json(vestObj); // Return the actual array, not a string
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


 const registerVestUser = asyncHandler(async function (req, res) {
  try {
    const user = await User.findById(req.id)
    if(!user.vestUnb.includes(req.body.vestibularId)){
      user.vestUnb.push(req.body.vestibularId);
      await user.save()
    }
    
  
    const vest = await VestUnb.findById(req.body.vestibularId)
    if(!vest.users.includes(req.id)){
      vest.users.push(user.id)
      await vest.save()
    }
   
    return res.status(200).json({message:"registered SucessFully"})


  }catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server Error" });
  }})

  const delteVestByUser = asyncHandler(async function (req, res) {
    try {
      const user = await User.findById(req.id)

      if(user.vestUnb.includes(req.body.vestibularId)){
        user.vestUnb.pull(req.body.vestibularId);
        await user.save()
      }
      
    
      const vest = await VestUnb.findById(req.body.vestibularId)
      if(vest.users.includes(req.id)){
        vest.users.pull(user.id)
        await vest.save()
      }
     
  
      return res.status(200).json({message:"deleted SucessFully"})
  
  
    }catch (error) {
      return res.status(500).json({ message: "internal server Error" });
    }})


module.exports = {getAllVest,getMyVest,registerVestUser,delteVestByUser}
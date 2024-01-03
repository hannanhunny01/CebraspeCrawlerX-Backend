const Concurso = require('../../models/concurso')
const User = require('../../models/userModel')

const asyncHandler = require("express-async-handler");


const getAllCon = asyncHandler(async function (req,res){
    try{
      const allConObject = await Concurso.find({})
      const user = await User.findById(req.id);
     

      if(user){
        const usersIds = user.concurso;
        const modifiedObjects = allConObject.map(obj => {
          const { items_on_site, users,items_on_site_number, ...rest } = obj._doc;
          return rest; 
        });

        const sendingObjects = modifiedObjects.filter( item => !usersIds.includes(item._id)   )

        return res.status(200).json(sendingObjects)

      }

    
    }catch(error){
        console.log(error)
    }
})


const getMyCon = asyncHandler(async function (req, res) {
  try {
    const user = await User.findById(req.id);
    
    if (user) {
      const conObj = [];

      for (const item of user.concurso) {
        
        const userConItem = await Concurso.findById(item); // Add await here
        const selectedFields = {
          _id: userConItem._id,
          name: userConItem.name,
          vagas: userConItem.vagas,
          remuneracao: userConItem.remuneracao,
          link_to_site: userConItem.link_to_site,
        };
        conObj.push(selectedFields);
      }

     

      return res.json(conObj); // Return the actual array, not a string
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


 const registerConUser = asyncHandler(async function (req, res) {
  try {
    const user = await User.findById(req.id)
    if(!user.concurso.includes(req.body.concursoId)){
      user.concurso.push(req.body.concursoId);
      await user.save()
    }
    
  
    const con = await Concurso.findById(req.body.concursoId)
    if(!con.users.includes(req.id)){
      con.users.push(user.id)
      await con.save()
    }
   
    return res.status(200).json({message:"registered SucessFully"})


  }catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server Error" });
  }})

  const delteConByUser = asyncHandler(async function (req, res) {
    try {
      const user = await User.findById(req.id)
      if(user.concurso.includes(req.body.concursoId)){
        user.concurso.pull(req.body.concursoId);
        await user.save()
      }
      
    
      const concurso = await Concurso.findById(req.body.concursoId)
      if(concurso.users.includes(req.id)){
        concurso.users.pull(user.id)
        await concurso.save()
      }
     
  
      return res.status(200).json({message:"deleted SucessFully"})
  
  
    }catch (error) {
      return res.status(500).json({ message: "internal server Error" });
    }})


module.exports = {getAllCon,getMyCon,registerConUser,delteConByUser}
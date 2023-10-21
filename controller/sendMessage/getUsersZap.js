
const User = require('../../models/userModel')

const getUser = async  function (userIds){

   try{
 const users = await User.find({ _id: { $in: userIds } })
 const contacts=[]
 for (const user of users){
   const person ={}
  
    if(user.phone !== undefined && user.phoneNotifications === true){
       person.name = user.username;
       person.whatsapp = user.phone
    }
    if(user.telegram!== undefined && user.telegramNotifications === true){
      person.name = user.username;
      person.telegram = user.telegram
 }  
   if(user.email !== undefined && user.emailNotifications === true){
      person.name = user.username;
      person.email = user.email
   }
   if(person.name !== undefined){
   contacts.push(person);
   }


}

return contacts
   }catch(error){
         console.log(error)
   }

}

module.exports = {getUser}
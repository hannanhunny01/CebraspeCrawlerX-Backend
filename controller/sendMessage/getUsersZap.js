
   const User = require('../../models/userModel')
   const VestUnb = require('../../models/vestibular')
   const Concurso = require('../../models/concurso')
   const PasUnb = require('../../models/pasunb');
   const { get } = require('mongoose');


   const checkAndUpdate = async function (id, type, model) {
      let document;
    
      switch (model) {
        case 'vestibular':
          document = await VestUnb.findById(id);
          break;
        case 'concurso':
          document = await Concurso.findById(id);
          break;
        case 'pas':
          document = await PasUnb.findById(id);
          break;
        default:
          throw new Error('Invalid model type');
      }
    
      if (!document) {
        throw new Error('Document not found');
      }
    
      switch (type) {
        case 'email':
          document.sendMessageEmail = document.items_on_site.length;
          break;
        case 'phone':
          document.sendMessagePhone = document.items_on_site.length;
          break;
        case 'telegram':
          document.sendMessageTelegram = document.items_on_site.length;
          break;
        default:
          throw new Error('Invalid type');
      }
    
      await document.save();
    };
    

   const getUser = async  function (userIds,id ,model){

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
         let foundEmail = false;
         let foundPhone = false;
         let foundTelegram = false;
         for (const item of contacts){
            if(item.email !== undefined){
               foundEmail = true;
            }
            if(item.whatsapp !== undefined){
               foundPhone = true;
            }
            if(item.telegram !== undefined){
               foundTelegram = true;
            }   
         }

         if(!foundEmail){   
            checkAndUpdate(id,'email',model)
         }
         if(!foundPhone){  
            checkAndUpdate(id,'phone',model)
         }
         if(!foundTelegram){     
            checkAndUpdate(id,'telegram',model)
         }



   console.log(contacts)
   return contacts
      }catch(error){
            console.log(error)
      }

   }

   module.exports = {getUser}
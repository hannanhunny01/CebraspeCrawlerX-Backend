const User = require('../../models/userModel')
const PasUnb = require('../../models/pasunb')
const asyncHandler = require("express-async-handler");
const axios = require('axios');
const { findLatestDate } = require('../../utils/latestDateChecker')

const {getUser} = require('./getUsersZap')
const sendMessagePas = asyncHandler(async function (req,res){
     try{
    const getPasUnb  = await  PasUnb.find({})
    const data =[]
    for(const item of getPasUnb){
        if(item.items_on_site_number<item.items_on_site.length){

         
          const all_titles= item.items_on_site
          let dates = all_titles.map(p=>p.date)
          const datesToSend =[]
          for(let i=item.items_on_site_number;i<item.items_on_site.length;i++){
            
            const latestDate = findLatestDate(dates)
            datesToSend.push(latestDate)
            dates = dates.filter(item => item !== latestDate)


          }
          
          const item_to_send = []
          for(const date of datesToSend){            
             const item_on_site= all_titles.filter(item => item.date == date)
            // console.log(item_on_site)
             item_to_send.push(...item_on_site)
        }


        const people = await getUser(item.users)
     
        if (people.length > 0){
          
            data.push({nameOfObject:item.stage_pas + " " + item.year_pas, updates:item_to_send ,people:people})
            
        }
    }

}
        if (data.length > 0){

            return res.json(data)
            const msgdata = await axios.post('http://localhost:4000/sendMessagePas', { data });
            
            // Return the response from the other server
            if(msgdata.data.message){
               for(const item of getPasUnb){
                  item.items_on_site_number = item.items_on_site.length
                  await item.save()
               }

                 

                 return res.json(msgdata.data.message);
            }else{
                res.json({message:"notSent"});
            }
            
        }else{
            // to add function to send me msg for no new update
            return res.json({message:"no new update"})
        }

       
           
    }
    catch(error){
        console.log(error)
    }

})

module.exports = {sendMessagePas}
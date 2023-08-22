const User = require('../../models/userModel')
const PasUnb = require('../../models/pasunb')
const asyncHandler = require("express-async-handler");
const axios = require('axios');
const { findLatestDate } = require('../../utils/latestDateChecker')

const {getUserZap} = require('./getUsersZap')
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
            if(item.stage_pas == "PAS 1" && item.year_pas == '2021'){
                console.log(i)
            }
            const latestDate = findLatestDate(dates)
            datesToSend.push(latestDate)
            dates = dates.filter(item => item !== latestDate)


          }
          
          const item_to_send = []
          for(const date of datesToSend){            
             const item_on_site= all_titles.filter(item => item.date == date)
             item_to_send.push(item_on_site)
        }

        const people = await getUserZap(item.users)
      
        if (people){
          
            data.push({nameOfObject:item.stage_pas+ +" "+ item.year_pas, updates:item_to_send ,people:people})
        }
    }

}

        if (data){
           return res.status(200).json({data})  
        }
    }
    catch(error){
        console.log(error)
    }

})

module.exports = {sendMessagePas}
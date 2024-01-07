const User = require('../../models/userModel')
const VestUnb = require('../../models/vestibular')
const asyncHandler = require("express-async-handler");
const axios = require('axios');
const { findLatestDate } = require('../../utils/latestDateChecker')

const {getUser} = require('./getUsersZap')
const sendMessageVest = asyncHandler(async function (){
     try{
    const getVest  = await  VestUnb.find({})
    const data =[]
    for(const item of getVest){

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


        const people = await getUser(item.users,item._id, 'vestibular');
     
        if (people.length > 0){
          
            data.push({itemId:item._id , itemType:"vestibular", nameOfObject:"VESTIBULAR :- " + item.name , updates:item_to_send ,people:people})
            
        }
    }

}
  console.log(data)

    if (data.length > 0) {
    const sendRequest = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({item:data})
  };

  const msgdata = await  fetch(`${process.env.MICROSERIVCE_URL}/api/message/sendMessage`, sendRequest);
  const answer = await msgdata.json();  
  return answer;
    } 

       
           
    }
    catch(error){
        console.log(error)
    }

})

module.exports = {sendMessageVest}
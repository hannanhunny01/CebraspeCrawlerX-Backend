const User = require('../../models/userModel')
const Concurso = require('../../models/concurso')
const asyncHandler = require("express-async-handler");
const axios = require('axios');
const { findLatestDate } = require('../../utils/latestDateChecker')

const {getUser} = require('./getUsersZap')

const sendMessageConcurso = asyncHandler(async function (req,res){
     try{
    const getConcurso  = await  Concurso.find({})
    const data =[]
    for(const item of getConcurso){
      const hasSend = item.sendMessageEmail || item.sendMessagePhone || item.sendMessageZap;
        if(item.items_on_site_number<item.items_on_site.length && !hasSend ){

         
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
            console.log(item._id)
            data.push({itemId:item._id , itemType:"concurso",nameOfObject:item.name + " " + item.vagas, updates:item_to_send ,people:people})
        }
    }

}
    if (data.length > 0) {
      const sendRequest = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({item:data})
    };

    const msgdata = await  fetch('http://localhost:4000/api/message/sendMessage', sendRequest);
    const answer = await msgdata.json();  
    console.log(answer) 
    return answer;
  } 

       
           
    }
    catch(error){
        console.log(error)
    }

})

module.exports = {sendMessageConcurso}
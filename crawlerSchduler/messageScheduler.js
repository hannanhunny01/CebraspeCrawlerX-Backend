
const {sendMessageVest} = require('../controller/sendMessage/sendMessageVest')
const {sendMessagePas} = require('../controller/sendMessage/sendMessagePas')
const {sendMessageConcurso} = require('../controller/sendMessage/sendMessageConcurso')


const items = [sendMessageVest,sendMessagePas,sendMessageConcurso]
const sendMessage = async ()=>{

   for (const item of items){
         if(!(await item())){
            // call erro sending Api
         }

       }


}


module.exports= {sendMessage}
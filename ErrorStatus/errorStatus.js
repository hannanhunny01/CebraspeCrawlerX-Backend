

const telegram = require('node-telegram-bot-api');


const erroStatus = async (apiName, errorMsg) => {

    try{
        
        const token = process.env.TELEGRAM_TOKEN
      const messageBot  =  new telegram(token, {polling: true});

        messageBot.sendMessage(process.env.TELEGRAM_USER_ID, "Error on Api \n" + apiName + "\n"+ errorMsg)
    

    messageBot.stopPolling();


    }catch(error){console.log(error)}

}

module.exports = { erroStatus } 
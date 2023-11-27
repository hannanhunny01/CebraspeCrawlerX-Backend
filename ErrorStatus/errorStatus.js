

const telegram = require('node-telegram-bot-api');


const errorStatus = async (apiName, errorMsg) => {

    try{
        
        const token = process.env.TELEGRAM_TOKEN_APIERROR;
      const messageBot  =  new telegram(token, {polling: true});

        messageBot.sendMessage(process.env.TELEGRAM_USERID, "Error on Api \n" + apiName + "\n"+ errorMsg)
    

    messageBot.stopPolling();


    }catch(error){console.log(error,"lol error on error handler")}

}

const testFunction = async () => {
    try{
        throw new Error("test error")
    }catch(error){

      errorStatus("testFunction",error)
    }
}

//testFunction()




module.exports = {errorStatus}
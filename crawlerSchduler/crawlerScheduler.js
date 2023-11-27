const cron = require('node-cron');

const { pasMainPage, pasPagesCrawler} = require('../controller/crawlers/pasCrawler');
const { vestMainPage,vestPagesCrawler } = require('../controller/crawlers/vestCrawler');
const { conMainPage,conPagesCrawler  } = require('../controller/crawlers/concursoCrawler');

const {errorStatus} = require('../ErrorStatus/errorStatus')

async function  testFunction  (){
  await new Promise((resolve) => {
    setTimeout(() => {
        console.log("testing");
        resolve();
    }, 3000);
   });
    return false;
}

const mainPageScheduler = [testFunction,pasMainPage, vestMainPage, conMainPage];
const allPageScheduler = [pasPagesCrawler, vestPagesCrawler, conPagesCrawler];

// Object to store retry counts for each function

async function checkMainPageCebraspe(items) {
  const maxRetries = 3;
  const retryCounts = {};

  console.log("running now")
  const functionStack = [...items]
  for (let i = 0; i < functionStack.length; ) {
    const func = functionStack[i];

    if (retryCounts[func] === undefined) {
      retryCounts[func] = 0;
    }

    if (retryCounts[func] < maxRetries) {
      if (await func()) {
   // If the function returns true, remove it from the stack
        functionStack.splice(i, 1);

        delete retryCounts[func];
      } else {
   // If the function returns false, move it to the end of the stack
        const failedFunc = functionStack.splice(i, 1)[0];
        functionStack.push(failedFunc);
        retryCounts[failedFunc]++; // Increment the retry count for this function
      }
    } else {
     // Remove the function if it has reached the maximum retries
      functionStack.splice(i, 1);

      delete retryCounts[func];
    }
  }

}




const schedulerOne =()=>{
  checkMainPageCebraspe(mainPageScheduler)
}

const schedulerTwo =()=>{
  checkMainPageCebraspe(allPageScheduler)
}



//cron.schedule('*/1 * * * *', schedulerOne);
//cron.schedule('*/2 * * * *', ()=>checkMainPageCebraspe(allPageScheduler));



//cron.start();

module.exports = {schedulerOne,schedulerTwo}
const cron = require('node-cron');

const { pasMainPage } = require('../crawlers/pasCrawler');
const { vestMainPage } = require('../crawlers/vestCrawler');
const { conMainPage } = require('../crawlers/concursoCrawler');

const mainPageScheduler = [pasMainPage, vestMainPage, conMainPage];

const maxRetries = 3;

// Object to store retry counts for each function
const retryCounts = {};

async function checkMainPageCebraspe() {
  functionStack = [...mainPageScheduler]
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


cron.schedule('0 */3 * * *', checkMainPageCebraspe);

cron.start();

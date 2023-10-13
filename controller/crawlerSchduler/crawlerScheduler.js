const cron = require('node-cron');

const { pasMainPage } = require('../crawlers/pasCrawler');
const { vestMainPage } = require('../crawlers/vestCrawler');
const { conMainPage } = require('../crawlers/concursoCrawler');

const mainPageScheduler = [pasMainPage, vestMainPage, conMainPage];

async function checkMainPageCebraspe() {
  const maxRetries = 3;

  for (let i = 0; i < mainPageScheduler.length; i++) {
    const item = mainPageScheduler[i];
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      success = await item();

      if (!success) {
        retryCount++;
      }
    }

    if (success) {
      mainPageScheduler.splice(i, 1);
      i--; 
    } else {
      mainPageScheduler.push(mainPageScheduler.splice(i, 1)[0]);
    }
  }
}

cron.schedule('0 */3 * * *', checkMainPageCebraspe);

cron.start();

const cron = require('node-cron');
const { schedulerOne, schedulerTwo } = require('./crawlerScheduler');
const { sendMessage } = require('./messageScheduler');
const { errorStatus } = require('../ErrorStatus/errorStatus');

const schedulerQueue = [];

function addToQueue(taskFunction, taskName) {
  try {
    schedulerQueue.push({ taskFunction, resolve: null });
    console.log(`${taskName} added to the queue`);
  } catch (error) {
    errorStatus(`error no scheduler ${taskName}`, error);
  }
}

async function processQueue() {
  if (schedulerQueue.length > 0) {
    const { taskFunction, resolve } = schedulerQueue.shift();
    console.log(`Running task`);
    try {
      await taskFunction();
    } catch (error) {
      // Handle errors in taskFunction if needed
      console.error(`Error running task: ${error}`);
    }
    console.log(`Task completed`);
    if (resolve) {
      resolve();
    }
  }
}
cron.schedule('0 0 */1 * *', () => {
  addToQueue(schedulerOne, 'SchedulerOne'); // Once a day
});

cron.schedule('0 */6 * * *', () => {
  addToQueue(schedulerTwo, 'SchedulerTwo'); // Every 6 hours
});

//cron.schedule('0 */4 * * *', () => {
//  addToQueue(sendMessage, 'SendMessage'); // Every 4 hours
//});

//cron.schedule('0 */3 * * *', processQueue); // Every 3 hours

//cron.schedule('*/1 * * * *', () => {
//  addToQueue(sendMessage, 'SendMessage'); // Every 2 minutes
//});

//addToQueue(schedulerOne, 'SchedulerOne'); 
//addToQueue(schedulerTwo, 'SchedulerTwo'); // Every 6 hours
addToQueue(sendMessage, 'SendMessage');
cron.schedule('*/1 * * * *', processQueue); // Every 2 minutes


module.exports = schedulerQueue;
const cron = require('node-cron');
const { schedulerOne, schedulerTwo } = require('./crawlerScheduler');
const { sendMessage } = require('./messageScheduler');
const { errorStatus } = require('../ErrorStatus/errorStatus');

const schedulerQueue = [];


function addToQueue(taskFunction, taskName, cronExpression) {
    try{
  cron.schedule(cronExpression, async () => {
    console.log(`${taskName} added to the queue`);
    await new Promise((resolve) => schedulerQueue.push({ taskFunction, resolve }));
    await processQueue();
  });
}catch(error){
    errorStatus(`error no scheduler ${taskName}`,error)
}
}

async function processQueue() {
  if (schedulerQueue.length > 0) {
    const { taskFunction, resolve } = schedulerQueue.shift();
    console.log(`Running task`);
    await taskFunction();
    console.log(`Task completed`);
    resolve();
    await processQueue(); 
  }
}

addToQueue(schedulerOne, 'SchedulerOne', '*/5 * * * *');
addToQueue(schedulerTwo, 'SchedulerTwo', '*/10 * * * *');
addToQueue(sendMessage, 'SendMessage', '*/15 * * * *');



module.exports = schedulerQueue;
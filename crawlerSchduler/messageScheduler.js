const { errorStatus } = require('../ErrorStatus/errorStatus');

const { sendMessageVest } = require('../controller/sendMessage/sendMessageVest');
const { sendMessagePas } = require('../controller/sendMessage/sendMessagePas');
const { sendMessageConcurso } = require('../controller/sendMessage/sendMessageConcurso');

const items = [async () => sendMessageVest(), async () => sendMessagePas(), async () => sendMessageConcurso()];

const sendMessage = async () => {
  for (const item of items) {
    try {
      await item();
    } catch (error) {
      errorStatus("error on service of sending msg", error);
    }
  }
};

module.exports = { sendMessage };

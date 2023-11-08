const crypto = require('crypto');

function encryptData(data, encryptionKey) {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey);

    let encryptedData = cipher.update(data, 'utf8', 'hex');

    encryptedData += cipher.final('hex');

    return encryptedData;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

const encryptionKey = 'key'; 
const data = 'Hello, this is a secret message.';

console.log(encryptData(data, encryptionKey));


const CryptoJS = require('crypto-js');

const key = 'liuxinyuqwe123@';

function decrypt(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

module.exports = { decrypt };

